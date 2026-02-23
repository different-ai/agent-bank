import Link from 'next/link';
import { ArrowRight, Bot, KeyRound, ShieldCheck, User } from 'lucide-react';
import GeneratedComponent from '@/app/(landing)/welcome-gradient';

const CURL_SNIPPET = `curl -X POST https://www.0.finance/api/cli/agent-login \\
  -H "Content-Type: application/json" \\
  -H "x-admin-token: $ZERO_FINANCE_ADMIN_TOKEN" \\
  -d '{
    "email": "finance-agent@acme.com",
    "workspace_name": "Acme Finance Agent",
    "company_name": "Acme Inc",
    "beneficiary_type": "business"
  }'`;

const CLI_SNIPPET = `zero auth agentlogin \\
  --email finance-agent@acme.com \\
  --workspace-name "Acme Finance Agent" \\
  --company-name "Acme Inc" \\
  --beneficiary-type business \\
  --admin-token $ZERO_FINANCE_ADMIN_TOKEN`;

export default function AgentLoginPage() {
  return (
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden">
      <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

      <div className="relative z-10 mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-[760px]">
          <p className="uppercase tracking-[0.14em] text-[11px] sm:text-[12px] font-medium text-[#1B29FF]">
            Authentication
          </p>
          <h1 className="mt-3 font-serif text-[34px] sm:text-[48px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            Human login and
            <span className="text-[#1B29FF]"> agent-native login</span>
          </h1>
          <p className="mt-4 text-[15px] sm:text-[17px] leading-[1.55] text-[#101010]/75">
            Humans use the normal Privy sign-in flow. Agents can provision and
            authenticate fully through API without getting stuck in browser-only
            connect loops.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-xl border border-[#101010]/10 bg-white/95 p-6 shadow-[0_10px_30px_rgba(16,16,16,0.06)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#101010]/5 flex items-center justify-center">
                <User className="h-5 w-5 text-[#101010]" />
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#101010]/55">
                  Human
                </p>
                <p className="text-[18px] font-medium text-[#101010]">Login</p>
              </div>
            </div>
            <p className="mt-4 text-[14px] text-[#101010]/70">
              Use this for team members approving proposals and reviewing
              activity in the dashboard.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded transition-colors"
            >
              Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-[#101010]/10 bg-white/95 p-6 shadow-[0_10px_30px_rgba(16,16,16,0.06)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-[#1B29FF]" />
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#101010]/55">
                  Agent
                </p>
                <p className="text-[18px] font-medium text-[#101010]">
                  Agent Login
                </p>
              </div>
            </div>
            <p className="mt-4 text-[14px] text-[#101010]/70">
              Provision a Privy user, create workspace API keys, and return KYB
              status in one API call. By default it also provisions an Ethereum
              wallet for the agent.
            </p>
            <a
              href="https://docs.0.finance/cli/reference"
              className="mt-6 inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#1B29FF] border border-[#1B29FF] hover:bg-[#1B29FF]/5 rounded transition-colors"
            >
              CLI reference
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#101010]/10 bg-[#0D1117] p-5 sm:p-6 text-[#E6EDF3] shadow-[0_12px_30px_rgba(13,17,23,0.25)]">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-[#8B949E]">
            <KeyRound className="h-4 w-4" />
            API-first agent provisioning
          </div>
          <pre className="mt-4 overflow-x-auto text-[12px] sm:text-[13px] leading-[1.55]">
            <code>{CURL_SNIPPET}</code>
          </pre>
        </div>

        <div className="mt-5 rounded-xl border border-[#101010]/10 bg-[#111827] p-5 sm:p-6 text-[#E5E7EB] shadow-[0_12px_30px_rgba(17,24,39,0.25)]">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-[#9CA3AF]">
            <Bot className="h-4 w-4" />
            CLI shortcut
          </div>
          <pre className="mt-4 overflow-x-auto text-[12px] sm:text-[13px] leading-[1.55]">
            <code>{CLI_SNIPPET}</code>
          </pre>
        </div>

        <div className="mt-6 rounded-lg border border-[#1B29FF]/20 bg-[#EAF0FF] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#1B29FF] mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-[#101010]">
                KYB-aware response
              </p>
              <p className="mt-1 text-[13px] text-[#101010]/70">
                The response includes `kyb.status`, `kyb.flow_link`, and starter
                account provisioning details so agents can decide whether to run
                KYB steps or proceed in starter mode.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-[14px] text-[#101010]/70 hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-4 hover:decoration-[#1B29FF] transition-colors"
          >
            Back to landing
          </Link>
        </div>
      </div>
    </section>
  );
}
