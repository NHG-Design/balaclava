const COOKIE_NAME = 'scenario-admin-session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export async function readScenarioAdminSession(
    cookieValue: string | null,
    platform: App.Platform | undefined
): Promise<string | null> {
    if (!cookieValue) return null;

    const env = getScenarioAdminEnv(platform);
    if (!env) return null;

    const parts = cookieValue.split('.');
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expectedSignature = await signPayload(payload, env.SCENARIO_ADMIN_SESSION_SECRET);
    if (!(await timingSafeEqual(signature, expectedSignature))) {
        return null;
    }

    let parsed: { username?: string; exp?: number } | null = null;
    try {
        parsed = JSON.parse(decodeBase64Url(payload)) as { username?: string; exp?: number };
    } catch {
        return null;
    }

    if (!parsed?.username || typeof parsed.exp !== 'number' || parsed.exp <= Date.now()) {
        return null;
    }

    if (parsed.username !== env.SCENARIO_ADMIN_USERNAME) {
        return null;
    }

    return parsed.username;
}

export async function verifyScenarioAdminCredentials(
    platform: App.Platform | undefined,
    username: string,
    password: string
): Promise<boolean> {
    const env = requireScenarioAdminEnv(platform);
    if (username !== env.SCENARIO_ADMIN_USERNAME) {
        return false;
    }

    const passwordHash = await sha256Hex(password);
    return timingSafeEqual(passwordHash, env.SCENARIO_ADMIN_PASSWORD_HASH);
}

export async function createScenarioAdminSessionCookie(
    platform: App.Platform | undefined,
    username: string
): Promise<{ name: string; value: string; maxAge: number }> {
    const env = requireScenarioAdminEnv(platform);
    const payload = encodeBase64Url(
        JSON.stringify({
            username,
            exp: Date.now() + SESSION_TTL_MS
        })
    );
    const signature = await signPayload(payload, env.SCENARIO_ADMIN_SESSION_SECRET);

    return {
        name: COOKIE_NAME,
        value: `${payload}.${signature}`,
        maxAge: SESSION_TTL_MS / 1000
    };
}

export function clearScenarioAdminSessionCookie() {
    return {
        name: COOKIE_NAME,
        value: '',
        maxAge: 0
    };
}

function getScenarioAdminEnv(platform: App.Platform | undefined) {
    const env = platform?.env;
    if (
        !env?.SCENARIO_ADMIN_USERNAME ||
        !env.SCENARIO_ADMIN_PASSWORD_HASH ||
        !env.SCENARIO_ADMIN_SESSION_SECRET
    ) {
        return null;
    }

    return env;
}

function requireScenarioAdminEnv(platform: App.Platform | undefined) {
    const env = getScenarioAdminEnv(platform);
    if (!env) {
        throw new Error('Scenario Admin secrets are not configured.');
    }

    return env;
}

async function signPayload(payload: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return encodeBytesBase64Url(new Uint8Array(signature));
}

async function sha256Hex(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function timingSafeEqual(left: string, right: string): Promise<boolean> {
    const leftBytes = new TextEncoder().encode(left);
    const rightBytes = new TextEncoder().encode(right);
    if (leftBytes.length !== rightBytes.length) {
        return false;
    }

    let mismatch = 0;
    for (let index = 0; index < leftBytes.length; index += 1) {
        mismatch |= leftBytes[index] ^ rightBytes[index];
    }

    return mismatch === 0;
}

function encodeBase64Url(value: string): string {
    return encodeBytesBase64Url(new TextEncoder().encode(value));
}

function encodeBytesBase64Url(bytes: Uint8Array): string {
    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): string {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
