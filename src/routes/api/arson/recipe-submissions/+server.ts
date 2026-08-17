import type { RequestHandler } from "./$types";
import { createClient } from "@libsql/client/web";
import { SCENARIOS } from "../../../../data/scenarios";
import { CATALOG, type ResourceId } from "../../../../data/catalog";
import { recipeSignature } from "$lib/recipe-diff";

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MINUTES = 60;

function formatRetryAfter(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes > 0 ? `${hours}h ${remMinutes}min` : `${hours}h`;
}

interface ActionItemPayload {
  resourceId: string;
  qty: number;
  optional?: boolean;
}

interface SubmissionPayload {
  scenarioName: string;
  payoutMin: number;
  payoutMax: number;
  submitterId?: string | null;
  submitterName?: string | null;
  recipe: {
    place: ActionItemPayload[];
    ignite: ActionItemPayload[];
    stoke?: ActionItemPayload[];
    stokeTime?: string;
    dampen?: ActionItemPayload[];
    dampenTime?: string;
  };
}

const scenarioNames = new Set(SCENARIOS.map((s) => s.scenarioName));
const resourceIds = new Set(Object.keys(CATALOG) as ResourceId[]);
const igniterIds = new Set(
  (Object.keys(CATALOG) as ResourceId[]).filter(
    (id) => CATALOG[id].category === "igniter",
  ),
);

function isValidIgniteItems(items: unknown): items is ActionItemPayload[] {
  return (
    isValidActionItems(items) &&
    (items as ActionItemPayload[]).every((item) =>
      igniterIds.has(item.resourceId as ResourceId),
    )
  );
}

function isValidActionItems(items: unknown): items is ActionItemPayload[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ActionItemPayload).resourceId === "string" &&
        resourceIds.has((item as ActionItemPayload).resourceId as ResourceId) &&
        Number.isFinite((item as ActionItemPayload).qty) &&
        (item as ActionItemPayload).qty > 0,
    )
  );
}

function validate(
  body: unknown,
): { ok: true; payload: SubmissionPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;

  if (
    typeof b.scenarioName !== "string" ||
    !scenarioNames.has(b.scenarioName)
  ) {
    return { ok: false, error: "Unknown scenario" };
  }
  if (!Number.isFinite(b.payoutMin) || !Number.isFinite(b.payoutMax)) {
    return { ok: false, error: "Payout min/max must be numbers" };
  }
  const payoutMin = b.payoutMin as number;
  const payoutMax = b.payoutMax as number;
  if (payoutMin < 0 || payoutMax < 0) {
    return { ok: false, error: "Payout must be non-negative" };
  }
  if (payoutMax < payoutMin) {
    return { ok: false, error: "Payout max must be >= min" };
  }

  const recipe = b.recipe as SubmissionPayload["recipe"] | undefined;
  if (typeof recipe !== "object" || recipe === null) {
    return { ok: false, error: "Missing recipe" };
  }
  if (!isValidActionItems(recipe.place)) {
    return { ok: false, error: "Invalid place materials" };
  }
  if (!isValidIgniteItems(recipe.ignite)) {
    return { ok: false, error: "Invalid igniter" };
  }
  if (recipe.stoke !== undefined && !isValidActionItems(recipe.stoke)) {
    return { ok: false, error: "Invalid stoke materials" };
  }
  if (recipe.dampen !== undefined && !isValidActionItems(recipe.dampen)) {
    return { ok: false, error: "Invalid dampen materials" };
  }
  if (recipe.stokeTime !== undefined && typeof recipe.stokeTime !== "string") {
    return { ok: false, error: "Invalid stokeTime" };
  }
  if (
    recipe.dampenTime !== undefined &&
    typeof recipe.dampenTime !== "string"
  ) {
    return { ok: false, error: "Invalid dampenTime" };
  }

  const submitterId =
    typeof b.submitterId === "string" && b.submitterId.trim() !== ""
      ? b.submitterId.trim()
      : null;
  const submitterName =
    typeof b.submitterName === "string" && b.submitterName.trim() !== ""
      ? b.submitterName.trim().slice(0, 50)
      : null;

  return {
    ok: true,
    payload: {
      scenarioName: b.scenarioName,
      payoutMin,
      payoutMax,
      submitterId,
      submitterName,
      recipe,
    },
  };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://www.torn.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const POST: RequestHandler = async ({
  request,
  platform,
  getClientAddress,
}) => {
  try {
    const response = await handler(request, platform, getClientAddress());
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  } catch (err) {
    console.error("recipe-submissions POST failed", err);
    return new Response(
      JSON.stringify({
        error:
          "Internal server error, if this happens again please contact Yukio [906148].",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      },
    );
  }
};

async function handler(
  request: Request,
  platform: App.Platform | undefined,
  clientIp: string,
) {
  const dbUrl = platform?.env?.TURSO_DATABASE_URL;
  const authToken = platform?.env?.TURSO_AUTH_TOKEN;
  if (!dbUrl || !authToken) {
    return new Response("Turso not configured", { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = createClient({ url: dbUrl, authToken });

  const recent = await client.execute({
    sql: `SELECT COUNT(*) as count, MIN(created_at) as oldest FROM recipe_submissions WHERE submitter_ip = ? AND created_at >= datetime('now', ?)`,
    args: [clientIp, `-${RATE_LIMIT_WINDOW_MINUTES} minutes`],
  });
  const recentCount = Number(recent.rows[0]?.count ?? 0);
  if (recentCount >= RATE_LIMIT_MAX) {
    const oldest = recent.rows[0]?.oldest;
    const oldestMs =
      typeof oldest === "string"
        ? Date.parse(`${oldest.replace(" ", "T")}Z`)
        : NaN;
    const retryAfterSeconds = Number.isFinite(oldestMs)
      ? Math.max(
          0,
          Math.ceil(
            (oldestMs + RATE_LIMIT_WINDOW_MINUTES * 60_000 - Date.now()) / 1000,
          ),
        )
      : RATE_LIMIT_WINDOW_MINUTES * 60;
    return new Response(
      JSON.stringify({
        error: `Rate limit exceeded: max ${RATE_LIMIT_MAX} submissions per ${RATE_LIMIT_WINDOW_MINUTES} minutes per IP. Try again in ${formatRetryAfter(retryAfterSeconds)}.`,
        limit: RATE_LIMIT_MAX,
        windowMinutes: RATE_LIMIT_WINDOW_MINUTES,
        retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSeconds),
        },
      },
    );
  }

  const { payload } = result;

  const newSignature = recipeSignature(
    payload.payoutMin,
    payload.payoutMax,
    payload.recipe,
  );

  const liveScenario = SCENARIOS.find(
    (s) => s.scenarioName === payload.scenarioName,
  );
  if (
    liveScenario &&
    recipeSignature(
      liveScenario.payoutMin,
      liveScenario.payoutMax,
      liveScenario.actions,
    ) === newSignature
  ) {
    return new Response(
      JSON.stringify({
        error:
          "This recipe is already live for this scenario, your userscript might be out of date. Update it userscript & check again.",
      }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    );
  }

  const existing = await client.execute({
    sql: `SELECT payout_min, payout_max, recipe FROM recipe_submissions WHERE scenario_name = ? AND status IN ('pending', 'approved', 'partial', 'merged')`,
    args: [payload.scenarioName],
  });
  const isDuplicate = existing.rows.some((row) => {
    try {
      const recipe = JSON.parse(String(row.recipe));
      return (
        recipeSignature(
          Number(row.payout_min),
          Number(row.payout_max),
          recipe,
        ) === newSignature
      );
    } catch {
      return false;
    }
  });
  if (isDuplicate) {
    return new Response(
      JSON.stringify({
        error:
          "Someone already submitted this exact recipe for this scenario. Your userscript might be out of date. Update it & check again.",
      }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    );
  }

  await client.execute({
    sql: `INSERT INTO recipe_submissions (scenario_name, payout_min, payout_max, submitter_id, submitter_name, submitter_ip, recipe) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      payload.scenarioName,
      payload.payoutMin,
      payload.payoutMax,
      payload.submitterId ?? null,
      payload.submitterName ?? null,
      clientIp,
      JSON.stringify(payload.recipe),
    ],
  });

  const remaining = Math.max(0, RATE_LIMIT_MAX - (recentCount + 1));
  return new Response(
    JSON.stringify({ ok: true, remaining, limit: RATE_LIMIT_MAX }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/** Public listing: pending/approved/merged submissions by default. Denied submissions are
 *  only included via ?status=denied. */
export const GET: RequestHandler = async ({ url, platform }) => {
  try {
    const dbUrl = platform?.env?.TURSO_DATABASE_URL;
    const authToken = platform?.env?.TURSO_AUTH_TOKEN;
    if (!dbUrl || !authToken) {
      return new Response("Turso not configured", { status: 500 });
    }

    const client = createClient({ url: dbUrl, authToken });

    const idFilter = Number(url.searchParams.get("id"));
    if (Number.isInteger(idFilter) && idFilter > 0) {
      const rows = await client.execute({
        sql: `
          SELECT id, scenario_name, payout_min, payout_max, submitter_id, submitter_name, recipe, status, pr_number, created_at, field_decisions, deny_note
          FROM recipe_submissions
          WHERE id = ?
        `,
        args: [idFilter],
      });
      return new Response(JSON.stringify({ submissions: rows.rows }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const playerFilter = url.searchParams.get("player")?.trim();
    if (playerFilter) {
      const like = `%${playerFilter}%`;
      const rows = await client.execute({
        sql: `
          SELECT id, scenario_name, payout_min, payout_max, submitter_id, submitter_name, recipe, status, pr_number, created_at, field_decisions, deny_note
          FROM recipe_submissions
          WHERE submitter_id LIKE ? OR submitter_name LIKE ?
          ORDER BY created_at DESC
        `,
        args: [like, like],
      });
      return new Response(JSON.stringify({ submissions: rows.rows }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const VALID_STATUSES = ["pending", "approved", "partial", "merged", "denied"];
    const statusFilter = url.searchParams.get("status");
    const requested = statusFilter
      ? statusFilter.split(",").filter((s) => VALID_STATUSES.includes(s))
      : [];
    const statuses =
      requested.length > 0
        ? requested
        : ["pending", "approved", "partial", "merged"];

    const limit = Math.min(
      Math.max(Number(url.searchParams.get("limit")) || 100, 1),
      200,
    );
    const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

    const placeholders = statuses.map(() => "?").join(", ");
    const rows = await client.execute({
      sql: `
        SELECT id, scenario_name, payout_min, payout_max, submitter_id, submitter_name, recipe, status, pr_number, created_at, field_decisions, deny_note
        FROM recipe_submissions
        WHERE status IN (${placeholders})
        ORDER BY scenario_name ASC, created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [...statuses, limit, offset],
    });

    const submissions = rows.rows;

    return new Response(JSON.stringify({ submissions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("recipe-submissions GET failed", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
