# Privy Agent-Native Login Report

Date: 2026-02-23
Branch: `feat/privy-agent-native-auth`

## Goal

Make authentication work cleanly for both audiences:

1. Humans: a clear `Login` path.
2. Agents: an API-first `Agent Login` path that provisions Privy + API keys without browser-only flow dependencies.

## What Changed

### 1) Website login split (human vs agent)

- Landing header now has:
  - `Login` -> `/signin`
  - `Agent Login` -> `/agent-login`
- Landing CTAs previously pointing to `/cli/connect` now point to `/agent-login`.
- Onboarding success page CLI CTA now points to `/agent-login`.
- Sign-in page includes a direct `Agent Login (API-first)` link.

### 2) New agent login page

- Added `/agent-login` page with:
  - Human login CTA (`/signin`)
  - Agent login docs/snippets
  - cURL example for `POST /api/cli/agent-login`
  - CLI example for `zero auth agentlogin`
  - KYB status explanation

### 3) New API endpoint: `POST /api/cli/agent-login`

- Requires `x-admin-token`.
- Supports agent provisioning inputs:
  - `email` / `phone` / `privy_user_id`
  - `workspace_name`, `company_name`, `beneficiary_type`
  - `first_name`, `last_name`
  - `wallets`, `create_direct_signer`
  - `api_key_name`, `api_key_expires_at`
  - `create_starter_accounts`, `destination_address`
- Behavior:
  - Creates or reuses Privy user identity
  - Ensures local workspace + profile records
  - Creates an API key
  - Attempts starter account provisioning (Align) when possible
  - Returns KYB status payload (`kyb.status`, `kyb.flow_link`, etc.)

### 4) CLI command: `zero auth agentlogin`

- Added `auth agentlogin` and top-level alias `agentlogin`.
- Calls `/api/cli/agent-login`, stores returned API key in CLI config, and prints workspace/KYB metadata.
- Updated missing-key guidance to include `agentlogin`.

### 5) CLI non-interactive hang fix

- Browser connect flow now fails fast in non-interactive sessions instead of hanging on input prompt.
- `zero auth connect --manual --no-browser` now exits with actionable guidance if stdin is non-interactive.
- Refactored `auth` command wiring so `zero auth connect ...` routes correctly as a real subcommand.

### 6) Workspace/user bootstrap fix for true API-native onboarding

- Fixed `ensureUserWorkspace` bootstrap path to handle the circular `users` <-> `workspaces` foreign key requirement in one SQL statement.
- Implemented a CTE-based insert that creates both records atomically for brand-new agent users.
- This unblocked full agent-native login for first-time users (no human/browser fallback required).

### 7) Wallet creation by default for agent login

- `agent-login` now defaults wallet requests to one Ethereum wallet when `wallets` is not provided.
- Existing Privy users are fetched to detect existing wallet addresses.
- If no wallet address is present, wallet pre-generation is attempted automatically.
- Response now includes `wallet.address`, `wallet.requested`, and provisioning state.

## Testing Evidence

## Type safety/build

- `pnpm --filter @zero-finance/web typecheck` -> pass
- `pnpm --filter agent-bank build` -> pass

## CLI behavior checks

- `node packages/cli/dist/index.js auth agentlogin --help` -> shows new agent-native flags
- `node packages/cli/dist/index.js agentlogin --help` -> top-level alias works
- `node packages/cli/dist/index.js auth connect --manual --no-browser` -> no hang; exits with explicit non-interactive guidance

## API route smoke test

- `POST /api/cli/agent-login` without admin token returns:
  - HTTP 401
  - `{"error":"Unauthorized: invalid admin token"}`

## Full E2E agent-native login proof (no human confirmation)

- Environment setup:
  - `docker compose -f docker-compose.lite.yml up -d`
  - `pnpm --filter @zero-finance/web db:migrate:lite`
  - `pnpm --filter @zero-finance/web dev:lite`
- Agent-native login command:
  - `node packages/cli/dist/index.js auth agentlogin --email agent-e2e-<timestamp>@example.com --workspace-name "Agent E2E Workspace" --company-name "Agent E2E Inc" --beneficiary-type business --admin-token <token> --base-url http://127.0.0.1:3000`
- Result:
  - `success: true`
  - `method: "agent_api"`
  - `workspace_name: "Agent E2E Workspace"`
  - `privy_user_id` returned
  - `api_key_id` returned
  - `wallet.address` returned
  - `kyb.status: "none"`
- Follow-up auth verification:
  - `node packages/cli/dist/index.js auth whoami`
  - Returned matching `workspace_id`, `workspace_name`, and `key_id`
- No browser prompt or human confirmation was required in this E2E flow.

## Default wallet E2E proof

- Command run without `--wallets-json`:
  - `node packages/cli/dist/index.js auth agentlogin --email agent-wallet-default-<timestamp>@example.com --workspace-name "Agent Wallet Default" --company-name "Wallet Default Inc" --beneficiary-type business --admin-token <token> --base-url http://127.0.0.1:3000`
- Result included:
  - `wallet.requested: [{"chain_type":"ethereum"}]`
  - non-null `wallet.address`
  - `starter_accounts.destination_address` equal to `wallet.address`

## UI verification screenshots

- `landing-login-agent-login.png`
  - Confirms split header buttons (`Login`, `Agent Login`) and updated landing CTAs.
- `agent-login-page.png`
  - Confirms dedicated API-first agent login page and command examples.
- `signin-with-agent-login-link.png`
  - Confirms human sign-in page now links to agent-native path.

## Notes

- Browser-based CLI connect route (`/cli/connect`) remains available for compatibility with existing CLI browser auth flow.
- Human website paths no longer require that route as the primary entrypoint.
