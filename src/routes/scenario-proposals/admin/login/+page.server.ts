import { fail, redirect } from '@sveltejs/kit';

import {
    clearScenarioAdminSessionCookie,
    createScenarioAdminSessionCookie,
    verifyScenarioAdminCredentials
} from '../../../../lib/server/scenario-proposals/auth.js';

export const load = async ({ locals }) => {
    if (locals.scenarioAdminUsername) {
        throw redirect(303, '/scenario-proposals/admin');
    }
};

export const actions = {
    default: async ({ request, cookies, platform, url }) => {
        const formData = await request.formData();
        const usernameEntry = formData.get('username');
        const passwordEntry = formData.get('password');
        const username = typeof usernameEntry === 'string' ? usernameEntry.trim() : '';
        const password = typeof passwordEntry === 'string' ? passwordEntry : '';
        const secure = url.protocol === 'https:';

        if (!username || !password) {
            return fail(400, { message: 'Username and password are required.' });
        }

        const isValid = await verifyScenarioAdminCredentials(platform, username, password);
        if (!isValid) {
            cookies.set(clearScenarioAdminSessionCookie().name, clearScenarioAdminSessionCookie().value, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure,
                maxAge: 0
            });

            return fail(401, { message: 'Invalid Scenario Admin credentials.' });
        }

        const sessionCookie = await createScenarioAdminSessionCookie(platform, username);
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure,
            maxAge: sessionCookie.maxAge
        });

        throw redirect(303, '/scenario-proposals/admin');
    }
};
