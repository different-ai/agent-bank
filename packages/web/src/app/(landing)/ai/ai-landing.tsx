'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '../header';
import { GradientBackground } from '../gradient-background';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';
import { CurrentYieldBadge } from '../current-yield-badge';
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Terminal,
  Command,
  Sparkles,
  GitBranch,
  Check,
} from 'lucide-react';

function TerminalCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#101010]/10 bg-white/95 shadow-[0_10px_30px_rgba(16,16,16,0.06)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#101010]/10 px-4 py-3 bg-[#F7F7F2]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-[#101010]">{title}</p>
            {subtitle ? (
              <p className="text-[11px] text-[#101010]/55">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <Terminal className="h-4 w-4 text-[#101010]/40" />
      </div>
      <div className="px-4 py-4 font-mono text-[12px] sm:text-[13px] leading-[1.55] text-[#101010]">
        {children}
      </div>
    </div>
  );
}

function CodeLine({
  prompt,
  children,
}: {
  prompt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="select-none text-[#101010]/35">{prompt ?? '$'}</span>
      <span className="break-words">{children}</span>
    </div>
  );
}

type HeroCodeTab = 'typescript' | 'python' | 'curl';

function HeroCodeTabs() {
  const [tab, setTab] = useState<HeroCodeTab>('typescript');

  const code = useMemo(() => {
    if (tab === 'python') {
      return (
        <>
          <div className="text-[#101010]/55"># Install + connect</div>
          <CodeLine>curl -fsSL https://zerofinance.ai/install | bash</CodeLine>
          <CodeLine>
            zero auth agentlogin --email finance-agent@acme.com
          </CodeLine>
          <div className="h-3" />
          <div className="text-[#101010]/55"># Use from scripts</div>
          <CodeLine>zero balance</CodeLine>
          <CodeLine>zero invoices create --help</CodeLine>
          <CodeLine>zero bank transfers propose</CodeLine>
        </>
      );
    }

    if (tab === 'curl') {
      return (
        <>
          <div className="text-[#101010]/55"># Install the CLI</div>
          <CodeLine>curl -fsSL https://zerofinance.ai/install | bash</CodeLine>
          <div className="h-3" />
          <div className="text-[#101010]/55"># Authenticate</div>
          <CodeLine>
            zero auth agentlogin --email finance-agent@acme.com
          </CodeLine>
          <div className="h-3" />
          <div className="text-[#101010]/55"># Debug + run</div>
          <CodeLine>zero --debug auth whoami</CodeLine>
          <CodeLine>zero savings positions</CodeLine>
        </>
      );
    }

    return (
      <>
        <div className="text-[#101010]/55"># Install + connect</div>
        <CodeLine>curl -fsSL https://zerofinance.ai/install | bash</CodeLine>
        <CodeLine>zero auth agentlogin --email finance-agent@acme.com</CodeLine>
        <div className="h-3" />
        <div className="text-[#101010]/55"># Workflows</div>
        <CodeLine>zero balance</CodeLine>
        <CodeLine>zero invoices create</CodeLine>
        <CodeLine>zero bank transfers propose</CodeLine>
      </>
    );
  }, [tab]);

  return (
    <TerminalCard
      title="Developer quick start"
      subtitle="TypeScript · Python · cURL"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(
          [
            { id: 'python', label: 'Python' },
            { id: 'typescript', label: 'TypeScript' },
            { id: 'curl', label: 'cURL' },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                'inline-flex items-center px-3 py-1.5 rounded-md text-[12px] border transition-colors ' +
                (active
                  ? 'bg-[#101010] text-white border-[#101010]'
                  : 'bg-white text-[#101010]/70 border-[#101010]/10 hover:border-[#101010]/20')
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {code}
      <div className="mt-3 text-[#101010]/55">
        Package: <span className="text-[#101010]">agent-bank</span>
        {' · '}Binary: <span className="text-[#101010]">zero</span>
      </div>
    </TerminalCard>
  );
}

export function AILanding() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-[#101010]/10 bg-white/90 overflow-hidden">
        <GradientBackground variant="demo" className="z-0 bg-[#F6F5EF]" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 w-full">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-[#1B29FF]">
            Dev Tools
          </p>
          <h1 className="mt-3 font-serif text-[36px] sm:text-[52px] md:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            CLI-first banking for{' '}
            <span className="text-[#1B29FF] text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.9]">
              AI agents.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-[62ch] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.5] text-[#222]">
            Give your agents access to a real bank account via a single CLI.
            Script invoices, propose ACH/IBAN transfers, match receipts, and
            view savings positions. Humans stay as the final approvers.
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B29FF]" />
              <span>Every workflow is scriptable via the `zero` CLI</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B29FF]" />
              <span>
                Transfers create proposals; approvals happen in the dashboard
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B29FF]" />
              <span>Forkable + self-hostable for custom agent workflows</span>
            </div>
          </div>

          {/* Live yield badge + Backed by */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CurrentYieldBadge />
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <span>Backed by</span>
              <OrangeDAOLogo className="h-4 w-auto opacity-70" />
            </div>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
            <Link
              className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              href="/signin"
            >
              Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-[#1B29FF] border border-[#1B29FF] hover:bg-[#1B29FF]/5 rounded-md transition-colors"
              href="/agent-login"
            >
              Agent Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
              href="https://docs.0.finance/cli/installation"
            >
              Install + docs
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <HeroCodeTabs />

            <div className="rounded-xl border border-[#101010]/10 bg-white/95 p-5 sm:p-6 shadow-[0_10px_30px_rgba(16,16,16,0.06)]">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#1B29FF]">
                What we offer
              </p>
              <h3 className="mt-2 font-serif text-[22px] sm:text-[26px] leading-[1.1] text-[#101010]">
                Banking primitives for enterprise agents
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                    <Command className="h-4 w-4 text-[#1B29FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      Invoicing
                    </p>
                    <p className="mt-1 text-[13px] text-[#101010]/65">
                      Create and send invoices from the terminal.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                    <GitBranch className="h-4 w-4 text-[#1B29FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      Bank transfers
                    </p>
                    <p className="mt-1 text-[13px] text-[#101010]/65">
                      Propose ACH/IBAN transfers; approvals happen in the
                      companion app.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-[#1B29FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      Approvals + audit
                    </p>
                    <p className="mt-1 text-[13px] text-[#101010]/65">
                      Every sensitive action is gated and reviewable in the
                      dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#1B29FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      SDKs + MCP
                    </p>
                    <p className="mt-1 text-[13px] text-[#101010]/65">
                      Use 0 Finance inside any MCP-enabled assistant.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href="/agent-login"
                  className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded transition-colors"
                >
                  Agent Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="https://docs.0.finance/cli/reference"
                  className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#1B29FF] border border-[#1B29FF] hover:bg-[#1B29FF]/5 rounded transition-colors"
                >
                  Docs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-10 sm:py-14 lg:py-18 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            How it works
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Install → Login → Script
          </h2>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-xl border border-[#101010]/10 bg-white/95 p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/55">
                Step 1
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                  <Command className="h-4 w-4 text-[#1B29FF]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#101010]">
                    Install the CLI
                  </p>
                  <p className="mt-1 text-[13px] text-[#101010]/65">
                    One command installs <span className="font-mono">zero</span>{' '}
                    and sets up auth.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#101010]/10 bg-white/95 p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/55">
                Step 2
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                  <GitBranch className="h-4 w-4 text-[#1B29FF]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#101010]">
                    Connect to your account
                  </p>
                  <p className="mt-1 text-[13px] text-[#101010]/65">
                    Use `agentlogin` for API-first auth or browser login for
                    humans.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#101010]/10 bg-white/95 p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/55">
                Step 3
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[#1B29FF]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#101010]">
                    Automate safely
                  </p>
                  <p className="mt-1 text-[13px] text-[#101010]/65">
                    Your agent can propose actions; humans remain approvers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common workflows */}
      <section className="relative bg-white border-t border-[#101010]/10 py-10 sm:py-14 lg:py-18 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Common workflows
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Copy-paste commands
          </h2>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <TerminalCard
              title="Balances + savings"
              subtitle="Visibility for agents and scripts"
            >
              <CodeLine>zero balance</CodeLine>
              <CodeLine>zero savings positions</CodeLine>
              <div className="h-3" />
              <div className="text-[#101010]/55">
                Use in cron jobs, bots, or CI to watch idle cash and positions.
              </div>
            </TerminalCard>

            <TerminalCard
              title="Invoices"
              subtitle="Create and send from the terminal"
            >
              <CodeLine>zero invoices create \\</CodeLine>
              <div className="pl-4 text-[#101010]/85">
                --recipient-email client@example.com \\
                <br />
                --amount 1000 \\
                <br />
                --currency USD \\
                <br />
                --description &quot;Consulting services&quot;
              </div>
              <CodeLine>zero invoices send --invoice-id inv_xxx</CodeLine>
            </TerminalCard>

            <TerminalCard
              title="Transfers"
              subtitle="Propose transfers; approve in dashboard"
            >
              <CodeLine>zero bank transfers propose</CodeLine>
              <div className="h-3" />
              <div className="flex items-start gap-2 text-[#101010]/65">
                <Shield className="h-4 w-4 mt-0.5 text-[#1B29FF]" />
                <span>
                  Transfers are gated: proposals require human approval before
                  execution.
                </span>
              </div>
            </TerminalCard>

            <TerminalCard
              title="Approval flow"
              subtitle="Agent proposes, humans approve"
            >
              <div className="text-[#101010]/55"># 1) Agent proposes</div>
              <CodeLine>zero bank transfers propose</CodeLine>
              <div className="h-3" />
              <div className="text-[#101010]/55">
                # 2) Proposal appears in 0 Finance web app
              </div>
              <CodeLine prompt="→">Human approves in dashboard</CodeLine>
              <div className="h-3" />
              <div className="text-[#101010]/55"># 3) Agent continues</div>
              <CodeLine>zero bank transfers list</CodeLine>
              <div className="mt-4">
                <Link
                  href="/signin?source=approvals"
                  className="inline-flex items-center text-[13px] font-medium text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                >
                  Open approvals dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </TerminalCard>

            <div className="rounded-xl border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                Developer-first
              </p>
              <h3 className="mt-2 font-serif text-[22px] sm:text-[26px] leading-[1.1] text-[#101010]">
                Designed to be embedded in your agent stack
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#1B29FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      MCP-compatible
                    </p>
                    <p className="mt-1 text-[13px] text-[#101010]/65">
                      Use 0 Finance tools inside any MCP-enabled assistant.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#1B29FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      Self-hosting optional
                    </p>
                    <p className="mt-1 text-[13px] text-[#101010]/65">
                      Fork and customize flows for your internal policies.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href="/signin?source=cli"
                  className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#101010] hover:bg-[#040404] rounded transition-colors"
                >
                  Open dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="https://docs.0.finance/mcp/overview"
                  className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#101010] border border-[#101010]/15 hover:bg-white rounded transition-colors"
                >
                  MCP setup
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section
        id="enterprise"
        className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-10 sm:py-14 lg:py-18 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Enterprise
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Approval-first automation
          </h2>
          <p className="mt-4 max-w-[70ch] text-[14px] sm:text-[15px] text-[#101010]/70">
            Agents propose actions from the CLI. Your team reviews and approves
            them in the companion web app. You get speed without giving up
            control.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/agent-login"
              className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded transition-colors"
            >
              Agent Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="https://cal.com/team/0finance/30"
              className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#101010] border border-[#101010]/15 hover:bg-white rounded transition-colors"
            >
              Talk to us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="relative bg-white border-t border-[#101010]/10 py-10 sm:py-14 lg:py-18 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Pricing
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Built for teams shipping with agents
          </h2>
          <p className="mt-4 max-w-[70ch] text-[14px] sm:text-[15px] text-[#101010]/70">
            If you are deploying agent-driven invoicing and payouts in
            production, we will help you set up the right approval policies and
            operating model.
          </p>
          <div className="mt-6">
            <Link
              href="https://cal.com/team/0finance/30"
              className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#101010] hover:bg-[#040404] rounded transition-colors"
            >
              Get pricing
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section
        id="blog"
        className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-10 sm:py-14 lg:py-18 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Blog
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Product notes + docs
          </h2>
          <p className="mt-4 max-w-[70ch] text-[14px] sm:text-[15px] text-[#101010]/70">
            Follow new CLI commands, new workflows, and recommended agent
            patterns in the docs.
          </p>
          <div className="mt-6">
            <Link
              href="https://docs.0.finance"
              className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#1B29FF] border border-[#1B29FF] hover:bg-[#1B29FF]/5 rounded transition-colors"
            >
              Read docs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CLI + MCP */}
      <section
        id="api-access"
        className="relative bg-white border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[680px]">
            <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#1B29FF]">
              CLI + MCP
            </p>
            <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Agent banking, programmable
            </h2>
            <p className="mt-4 text-[14px] sm:text-[15px] text-[#101010]/70">
              Install the agent-bank CLI, then connect via MCP so any assistant
              can call the same banking primitives your scripts use.
            </p>
            <div className="mt-6 p-4 bg-[#F7F7F2] border border-[#101010]/10 rounded font-mono text-[13px]">
              <span className="text-[#101010]/50">$</span>{' '}
              <span className="text-[#1B29FF]">curl</span> -fsSL
              https://zerofinance.ai/install | bash
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/agent-login"
                className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded transition-colors"
              >
                Agent Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="https://docs.0.finance/cli/reference"
                className="inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#1B29FF] border border-[#1B29FF] hover:bg-[#1B29FF]/5 rounded transition-colors"
              >
                CLI reference
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#101010]/10 bg-[#F7F7F2] py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px]">
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Build with{' '}
              <span className="text-[#1B29FF]">banking primitives</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[18px] text-[#101010]/70">
              0 Finance is a CLI-first bank account for agentic workflows.
              Script what you need, keep approvals human, and ship faster.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/agent-login"
                className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                Agent Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="https://docs.0.finance/cli/installation"
                className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
              >
                Install instructions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-[12px] text-[#101010]/60">
                © 2025 0 Finance
              </span>
              <Link
                href="/legal"
                className="text-[12px] text-[#101010]/60 hover:text-[#1B29FF]"
              >
                Legal
              </Link>
              <Link
                href="/privacy"
                className="text-[12px] text-[#101010]/60 hover:text-[#1B29FF]"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/40">
                Backed by
              </span>
              <OrangeDAOLogo className="h-4 sm:h-5 w-auto opacity-50 grayscale" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
