# Agent-Pure Auth Security Report

Date: 2026-02-23
Scope: `zero auth agentlogin` and `POST /api/cli/agent-login`

## Executive Summary

Agent-pure login removes browser friction and enables deterministic automation, but it shifts trust from end-user interaction to machine credentials (`x-admin-token`, API keys, CI/runtime secret handling).

Security posture improves for automation reliability and replay control, while key-management and privilege-boundary risks become more important than phishing/interactive-session risks.

## Human vs Agent-Pure Flow

### Human interactive flow

- Entry: `/signin` and browser-mediated Privy auth.
- Primary trust anchor: end-user interaction + Privy session.
- Typical risk profile:
  - lower automation abuse potential
  - higher social-engineering/phishing exposure
  - stronger user presence signal

### Agent-pure flow

- Entry: `zero auth agentlogin` -> `POST /api/cli/agent-login`.
- Primary trust anchor: server-side admin token + generated workspace API key.
- Typical risk profile:
  - strong automation reliability and deterministic behavior
  - minimal phishing surface (no browser handoff)
  - higher secret theft/blast-radius risk if token scopes are broad

## Security Effects of Agent-Pure Flow

1. **Reduced interactive attack surface**

- No browser callback loop or manual copy/paste auth steps.
- Less opportunity for phishing through fake connect pages.

2. **Increased credential governance requirements**

- Admin token misuse can create identities and keys at scale.
- Requires strict storage, rotation, and environment isolation.

3. **Improved machine verifiability**

- API responses include KYB and provisioning state, making policy checks explicit and auditable.
- Easier to gate downstream actions on machine-readable status.

4. **Shift from user-intent validation to policy validation**

- Human confirmation is removed by design.
- Compensating controls must enforce intent through role-bound tokens, logging, and limits.

## Controls in This PR

- Admin-gated endpoint (`x-admin-token`) for agent provisioning.
- Workspace-scoped API keys returned and stored by CLI.
- Structured response includes `kyb` and starter-account status for policy decisions.
- Non-interactive browser connect fails fast (prevents hanging auth states).
- Agent login now provisions a wallet by default (Ethereum), removing "auth succeeded but no wallet" dead-ends.

## New Risks to Watch

1. **Admin token overreach**

- If a shared admin token leaks, attacker can bootstrap many agent identities and API keys.

2. **Unattended key persistence**

- CLI config stores returned API keys; host compromise exposes active credentials.

3. **Provisioning abuse at scale**

- Automated endpoint allows high-frequency account creation if rate controls are absent.

4. **Policy bypass through weak runtime controls**

- If workflows do not enforce KYB/KYC preconditions, automation can proceed farther than intended.

## Recommended Hardening

1. **Token scope + TTL**

- Introduce short-lived, narrowly scoped admin provisioning tokens.

2. **Endpoint rate limiting + anomaly detection**

- Rate limit `/api/cli/agent-login` by token/IP and alert on bursts.

3. **Strong audit trails**

- Log provisioning actor, source, workspace, and resulting key IDs.

4. **Key lifecycle controls**

- Enforce expiration defaults for generated API keys.
- Automate rotation and revocation for inactive keys.

5. **Policy gates on KYB/KYC state**

- Require explicit state checks before privileged banking actions.

6. **Secret handling standards**

- Keep admin tokens only in secret managers (not committed env files).
- Separate prod/staging tokens and restrict workstation usage.
