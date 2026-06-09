import { fail } from '@sveltejs/kit';

import { createScenarioProposal, findActiveSubmitterByToken } from '../../lib/server/scenario-proposals/db.js';
import {
    buildScenarioFormCatalog,
    parseScenarioProposalSubmission,
    ScenarioProposalFormError
} from '../../lib/server/scenario-proposals/form.js';

export const load = async () => {
    return {
        scenarios: buildScenarioFormCatalog()
    };
};

export const actions = {
    default: async ({ request, platform }) => {
        const formData = await request.formData();

        try {
            const submission = parseScenarioProposalSubmission(formData);
            const submitter = await findActiveSubmitterByToken(platform, submission.submitToken);
            if (!submitter) {
                return fail(401, {
                    message: 'Scenario Submit Token is invalid or revoked.'
                });
            }

            await createScenarioProposal(platform, {
                submitterId: submitter.submitterId,
                scenarioName: submission.scenarioName,
                submitToken: submission.submitToken,
                proposalPatch: submission.proposalPatch,
                rawSubmission: submission.rawSubmission,
                supportingRun: submission.supportingRun
            });

            return {
                success: true,
                message: `Scenario Proposal stored for ${submission.scenarioName}.`
            };
        } catch (error) {
            if (error instanceof ScenarioProposalFormError) {
                return fail(400, {
                    message: 'Fix the validation errors and resubmit.',
                    issues: error.issues
                });
            }

            throw error;
        }
    }
};
