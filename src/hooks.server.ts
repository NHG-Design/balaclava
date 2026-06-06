import type { Handle } from '@sveltejs/kit';

import { readScenarioAdminSession } from './lib/server/scenario-proposals/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.scenarioAdminUsername = await readScenarioAdminSession(
        event.cookies.get('scenario-admin-session') ?? null,
        event.platform
    );

    return resolve(event);
};
