PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS scenario_submitters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL UNIQUE,
    player_name TEXT NOT NULL,
    notes TEXT,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at_utc TEXT NOT NULL,
    updated_at_utc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scenario_submit_tokens (
    id TEXT PRIMARY KEY,
    submitter_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    label TEXT,
    created_at_utc TEXT NOT NULL,
    revoked_at_utc TEXT,
    last_used_at_utc TEXT,
    FOREIGN KEY (submitter_id) REFERENCES scenario_submitters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_scenario_submit_tokens_submitter_id
    ON scenario_submit_tokens (submitter_id);

CREATE TABLE IF NOT EXISTS scenario_triage_records (
    id TEXT PRIMARY KEY,
    scenario_name TEXT NOT NULL,
    normalized_patch TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at_utc TEXT NOT NULL,
    updated_at_utc TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scenario_triage_records_scenario_name
    ON scenario_triage_records (scenario_name);

CREATE TABLE IF NOT EXISTS scenario_proposals (
    id TEXT PRIMARY KEY,
    submitter_id INTEGER NOT NULL,
    scenario_name TEXT NOT NULL,
    proposal_patch_json TEXT NOT NULL,
    raw_submission_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    normalized_patch TEXT,
    triage_record_id TEXT,
    created_at_utc TEXT NOT NULL,
    reviewed_at_utc TEXT,
    FOREIGN KEY (submitter_id) REFERENCES scenario_submitters(id) ON DELETE RESTRICT,
    FOREIGN KEY (triage_record_id) REFERENCES scenario_triage_records(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_scenario_proposals_scenario_name
    ON scenario_proposals (scenario_name);

CREATE INDEX IF NOT EXISTS idx_scenario_proposals_status
    ON scenario_proposals (status);

CREATE TABLE IF NOT EXISTS scenario_supporting_runs (
    id TEXT PRIMARY KEY,
    proposal_id TEXT NOT NULL,
    observed_payout INTEGER NOT NULL,
    is_complete_evidence INTEGER NOT NULL CHECK (is_complete_evidence IN (0, 1)),
    actions_json TEXT NOT NULL,
    notes TEXT,
    created_at_utc TEXT NOT NULL,
    FOREIGN KEY (proposal_id) REFERENCES scenario_proposals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_scenario_supporting_runs_proposal_id
    ON scenario_supporting_runs (proposal_id);

CREATE TABLE IF NOT EXISTS scenario_triage_record_members (
    id TEXT PRIMARY KEY,
    triage_record_id TEXT NOT NULL,
    proposal_id TEXT NOT NULL UNIQUE,
    created_at_utc TEXT NOT NULL,
    FOREIGN KEY (triage_record_id) REFERENCES scenario_triage_records(id) ON DELETE CASCADE,
    FOREIGN KEY (proposal_id) REFERENCES scenario_proposals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_scenario_triage_record_members_triage_record_id
    ON scenario_triage_record_members (triage_record_id);

CREATE TABLE IF NOT EXISTS scenario_pr_events (
    id TEXT PRIMARY KEY,
    triage_record_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at_utc TEXT NOT NULL,
    FOREIGN KEY (triage_record_id) REFERENCES scenario_triage_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_scenario_pr_events_triage_record_id
    ON scenario_pr_events (triage_record_id);
