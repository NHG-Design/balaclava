---
name: sentinel
description: 'Performs a rigorous static security audit of a web application codebase. Produces a summary table (PASS / FAIL / MANUAL-REVIEW) and per-finding blocks with file and line evidence, risk description, and remediation code. Use for a security audit or review, checking for vulnerabilities, or scanning before a release or pen-test engagement. Covers XSS, SQLi, CSP, authn/authz, secrets, and dependency CVEs. Not for general code review or style/architecture feedback — this skill is security-specific.'
disable-model-invocation: true
---

# Security Audit Skill

Perform a rigorous static security audit of a web application codebase. Produces a summary table (PASS / FAIL / MANUAL-REVIEW) and per-finding blocks with file:line evidence, risk description, and remediation code.

---

## Phase 1 — Stack Triage

Before scanning any code, answer these questions by reading `package.json`, config files, and `README`:

1. **Framework**: SvelteKit / Next.js / Express / FastAPI / etc.
2. **Database driver**: parameterized (libsql, pg, prisma) vs. raw string (low-level drivers)
3. **Auth mechanism**: JWT / HMAC tokens / sessions / OAuth
4. **Deploy target**: Fly.io / Cloudflare / Vercel / bare Node — determines which IP header to trust for rate-limiting and audit logs (`Fly-Client-IP` vs `CF-Connecting-IP` vs `X-Forwarded-For`); trusting the wrong one lets an attacker spoof their source IP
5. **File uploads**: yes/no — if yes, where stored (local FS, S3-compatible, CDN)
6. **External outbound calls**: email API, webhooks, media fetch — potential SSRF surfaces

State your stack summary in one paragraph before Phase 2. Wrong assumptions here produce wrong findings.

---

## Phase 2 — Scan

MANDATORY READ: [`references/security-checklist.md`](references/security-checklist.md)

Do NOT load `references/security-checklist.md` for targeted single-endpoint reviews — it will expand scope beyond the task. Load it only for full-codebase audits.

Work through every category in the checklist in order — skipping a group requires a written reason in the report.

For each category:

- Read the relevant source file(s). Do not mark PASS from memory.
- If the file doesn't exist, mark MANUAL-REVIEW with a note.
- Record the verdict (PASS / FAIL / MANUAL-REVIEW) and one-line evidence note.

If the repo is too large to read every file, prioritise by risk: auth flows and token handling first, then input/output boundaries, then dependency config. Note which files were skipped.

---

## Phase 3 — Classify

Review your raw scan notes. For each item, apply the verdict rules:

- **PASS** — you read the relevant code and confirmed the control is in place. Cite file:line.
- **FAIL** — you found a confirmed, exploitable gap. You have a snippet. You can write a fix.
- **MANUAL-REVIEW** — the verdict requires runtime context, infrastructure access, or human judgment (e.g. "verify this token has read-only scope on the Turso dashboard").

> Before assigning a verdict, ask: "Can I write the remediation code right now, using only what I've read?" Yes → FAIL. No → MANUAL-REVIEW.

Do not downgrade a FAIL to MANUAL-REVIEW to soften the report.

---

## Phase 4 — Report

**Summary table first:**

| # | Category | Status | Notes |
|---|----------|--------|-------|
| 1 | SQL injection | PASS | Parameterized throughout |
| 2 | XSS | FAIL | `{@html}` on user-controlled field — see finding |
| … | … | … | … |

**Then, for every FAIL and MANUAL-REVIEW, a finding block:**

```text
### [N]. CATEGORY — FAIL
**File:** `src/lib/example.ts:42`
**Snippet:**
  cookies.set(name, token, { httpOnly: true })   // ← missing Secure flag
**Risk:** Cookie transmitted over plain HTTP in non-production; captured by passive MITM.
**Fix:**
  cookies.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
```

MANUAL-REVIEW blocks use the same format but replace **Fix** with **Action** describing what the human must verify and where.

PASS items appear only in the summary table — no blocks.

---

## NEVER

- **NEVER mark PASS without reading the file**
  **Instead:** Read the file, cite file:line in the evidence note.
  **Why:** Memory-based PASS verdicts produce false assurance — the whole point of the audit is evidence.

- **NEVER mark FAIL without a code snippet**
  **Instead:** Quote the exact vulnerable line(s). If you can't find a snippet, it's MANUAL-REVIEW.
  **Why:** A FAIL without evidence is noise; developers need the exact location to fix it.

- **NEVER conflate FAIL and MANUAL-REVIEW**
  **Instead:** FAIL = you can write the fix right now. MANUAL-REVIEW = you cannot, and you say why.
  **Why:** Mixing them destroys the actionability of the report.

- **NEVER skip Phase 1 stack triage**
  **Instead:** Read `package.json` and one config file before scanning anything.
  **Why:** Which IP header to trust, which CSP approach is valid, and which auth model applies all depend on the stack — wrong assumptions cascade into wrong verdicts.

- **NEVER report remediation code that doesn't match the project's framework/library**
  **Instead:** Write fixes using the exact APIs already in use (e.g. SvelteKit `cookies.set`, not `res.setHeader`).
  **Why:** Generic remediation that doesn't compile is ignored; framework-specific fixes get merged.

- **NEVER write a finding block for a category you haven't read the source file for**
  **Instead:** Open the file, read it, then write the block.
  **Why:** A finding block without file evidence is assertion, not audit — it erodes trust in the whole report when it turns out to be wrong.

- **NEVER silently skip files in a large repo**
  **Instead:** Prioritise by risk (auth/token handling → input/output boundaries → dependency config) and explicitly list every skipped file in the report.
  **Why:** Silent skips make the audit's coverage claims unverifiable — a clean report on an incomplete scan reads as a false all-clear.
