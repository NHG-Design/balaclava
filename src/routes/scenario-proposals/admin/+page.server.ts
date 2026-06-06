import { redirect } from '@sveltejs/kit';

import { clearScenarioAdminSessionCookie } from '../../../lib/server/scenario-proposals/auth.js';
import { listScenarioProposals } from '../../../lib/server/scenario-proposals/db.js';

export const load = async ({ locals, platform }) => {
    if (!locals.scenarioAdminUsername) {
        throw redirect(303, '/scenario-proposals/admin/login');
    }

    return {
        scenarioAdminUsername: locals.scenarioAdminUsername,
        proposals: await listScenarioProposals(platform)
    };
};

export const actions = {
    logout: async ({ cookies, url }) => {
        const sessionCookie = clearScenarioAdminSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: url.protocol === 'https:',
            maxAge: sessionCookie.maxAge
        });

        throw redirect(303, '/scenario-proposals/admin/login');
    }
};
