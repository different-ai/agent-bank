'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Loader2,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

import GeneratedComponent from '@/app/(landing)/welcome-gradient';
import { EnsureEmbeddedWallet } from '@/components/auth/ensure-embedded-wallet';
import {
  StepStatus,
  usePrimaryAccountSetup,
} from '@/hooks/use-primary-account-setup';
import { api } from '@/trpc/react';

const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
]);

function toTitleCase(input: string) {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

function suggestWorkspaceName(email: string | null | undefined) {
  if (!email) return 'Personal Workspace';
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return 'Personal Workspace';

  const domain = parts[1];
  if (!domain || PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return 'Personal Workspace';
  }

  const base = domain.split('.')[0];
  if (!base) return 'Personal Workspace';
  return `${toTitleCase(base)} Workspace`;
}

export default function WelcomePage() {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();

  const startedRef = useRef(false);
  const [setupAttempt, setSetupAttempt] = useState(0);
  const [workspaceStatus, setWorkspaceStatus] = useState<StepStatus>('pending');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showAiEmailIntro, setShowAiEmailIntro] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { data: workspaceData, isLoading: workspaceLoading } =
    api.workspace.getOrCreateWorkspaceV2.useQuery(undefined, {
      enabled: ready && authenticated,
    });

  const updateCompanyMutation = api.workspace.updateCompanyName.useMutation();
  const {
    progress,
    isRunning: isSettingUp,
    error: setupError,
    runSetup,
    reset,
  } = usePrimaryAccountSetup();

  const isProcessing = updateCompanyMutation.isPending || isSettingUp;

  // Fetch AI email address after setup completes (non-blocking).
  const { data: aiEmailData } = api.workspace.getAiEmailAddress.useQuery(
    { workspaceId: workspaceData?.workspaceId ?? '' },
    { enabled: !!workspaceData?.workspaceId && showAiEmailIntro },
  );

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  // Default bimodal mode to non-technical unless the user already chose.
  useEffect(() => {
    if (!ready || !authenticated) return;
    try {
      const existing = localStorage.getItem('zero-finance-bimodal-mode');
      if (existing === null) {
        localStorage.setItem('zero-finance-bimodal-mode', 'false');
      }
    } catch {
      // ignore
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (!ready || !authenticated || workspaceLoading) return;
    const workspaceId = workspaceData?.workspaceId;
    const currentName = workspaceData?.workspace?.name;
    if (!workspaceId) return;
    const ensuredWorkspaceId = workspaceId;
    if (startedRef.current) return;

    startedRef.current = true;

    async function runAutopilotSetup() {
      setWorkspaceStatus('in_progress');

      const userEmail =
        user?.email?.address ?? user?.google?.email ?? undefined;
      const userName =
        user?.google?.name || userEmail?.split('@')[0] || 'Unknown';
      const suggestedName = suggestWorkspaceName(userEmail);

      try {
        // Only rename if this is still the default.
        if (currentName === 'Personal Workspace' && suggestedName) {
          await updateCompanyMutation.mutateAsync({
            workspaceId: ensuredWorkspaceId,
            companyName: suggestedName,
            userName,
            userEmail,
          });
        }

        setWorkspaceStatus('success');
      } catch (error) {
        console.error('Failed to update workspace name:', error);
        // Non-fatal: continue onboarding even if workspace naming fails.
        setWorkspaceStatus('error');
      }

      try {
        await runSetup();
        setIsSetupComplete(true);
        setShowAiEmailIntro(true);
      } catch (error) {
        console.error('Primary account setup failed:', error);
      }
    }

    void runAutopilotSetup();
  }, [
    ready,
    authenticated,
    workspaceLoading,
    workspaceData?.workspaceId,
    workspaceData?.workspace?.name,
    setupAttempt,
    runSetup,
    updateCompanyMutation,
    user,
  ]);

  useEffect(() => {
    if (!showAiEmailIntro) return;
    const t = window.setTimeout(() => {
      router.push('/dashboard');
    }, 1800);
    return () => window.clearTimeout(t);
  }, [showAiEmailIntro, router]);

  const handleCopyEmail = async () => {
    if (!aiEmailData?.email) return;
    await navigator.clipboard.writeText(aiEmailData.email);
    setCopiedEmail(true);
    toast.success('AI inbox copied');
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const statusItems = useMemo(() => {
    const workspaceName = workspaceData?.workspace?.name;
    return [
      {
        title: 'Preparing your workspace',
        status: workspaceStatus,
        detail: workspaceName ? `Workspace: ${workspaceName}` : undefined,
      },
      ...progress.map((item) => ({
        title: item.label,
        status: item.status,
        detail: item.detail,
      })),
    ];
  }, [progress, workspaceData?.workspace?.name, workspaceStatus]);

  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-5 w-5 animate-spin text-[#0050ff]" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const handleRetry = async () => {
    startedRef.current = false;
    setWorkspaceStatus('pending');
    reset();
    setIsSetupComplete(false);
    setShowAiEmailIntro(false);
    setSetupAttempt((prev) => prev + 1);
  };

  if (!ready || !authenticated || workspaceLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0050ff] border-t-transparent" />
      </div>
    );
  }

  // Success view with AI inbox.
  if (showAiEmailIntro) {
    return (
      <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
        <GeneratedComponent className="z-0 bg-[#F6F5EF]" />
        <div className="relative z-10 w-full max-w-[560px] px-4">
          <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
                </div>
                <p className="uppercase tracking-[0.14em] text-[11px] font-medium text-[#10B981] mb-2">
                  ACCOUNT READY
                </p>
                <h1 className="font-serif text-[32px] sm:text-[40px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                  You are set up.
                </h1>
                <p className="mt-3 text-[13px] text-[#101010]/60">
                  Redirecting you to the dashboard...
                </p>
              </div>

              <div className="bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#1B29FF]/10 rounded-full">
                    <Mail className="h-5 w-5 text-[#1B29FF]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[#101010]">
                      Your AI inbox
                    </h3>
                    <p className="text-[12px] text-[#101010]/60">
                      Forward invoices, receipts, and payment requests.
                    </p>
                  </div>
                </div>

                {aiEmailData?.email ? (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#101010]/50">
                      Email address
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-[#101010]/10 px-4 py-3 rounded">
                        <code className="text-[13px] font-medium text-[#101010]">
                          {aiEmailData.email}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="h-12 w-12 flex items-center justify-center border border-[#101010]/10 rounded hover:bg-[#F7F7F2] transition-colors"
                        title="Copy email address"
                      >
                        {copiedEmail ? (
                          <Check className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <Copy className="h-4 w-4 text-[#101010]/60" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-12 animate-pulse bg-[#101010]/5 rounded" />
                )}

                <div className="pt-2">
                  <p className="text-[12px] text-[#101010]/60">
                    Humans stay in the loop: no payments execute without your
                    approval.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-[#0050ff] hover:bg-[#0040dd] rounded-md transition-colors w-full sm:w-auto"
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <Link
                  href="/agent-login"
                  className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-[#0050ff] border border-[#0050ff] hover:bg-[#0050ff]/5 rounded-md transition-colors w-full sm:w-auto"
                >
                  Agent Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
      <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

      <div className="relative z-10 w-full max-w-[560px] px-4">
        <EnsureEmbeddedWallet />

        <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
          <div className="space-y-6">
            <div>
              <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] font-medium text-[#101010]/70 mb-3">
                SETTING UP
              </p>
              <h1 className="font-serif text-[32px] sm:text-[40px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                Creating your agent bank
              </h1>
              <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.5] text-[#101010]/70">
                This runs automatically. We will create your secure smart
                account and prepare your workspace.
              </p>
            </div>

            <div className="space-y-3 border border-[#101010]/10 rounded-md px-4 py-4 bg-[#F9F9F3]">
              <p className="text-[12px] uppercase tracking-[0.12em] text-[#101010]/60">
                Setup progress
              </p>
              <ul className="space-y-3">
                {statusItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {renderStatusIcon(item.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#101010]">
                        {item.title}
                      </p>
                      {item.detail ? (
                        <p className="text-xs text-[#101010]/70 mt-1">
                          {item.detail}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>

              {setupError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {setupError}
                </div>
              ) : null}

              {isSetupComplete ? (
                <div className="rounded-md border border-[#0050ff]/20 bg-[#EAF0FF] px-3 py-2 text-sm text-[#0038cc]">
                  All set. Redirecting...
                </div>
              ) : null}
            </div>

            {!isProcessing && (workspaceStatus === 'error' || !!setupError) ? (
              <button
                type="button"
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#101010] hover:bg-[#040404] rounded-md transition-colors"
              >
                Retry setup
              </button>
            ) : null}

            <div className="pt-2">
              <p className="text-[12px] text-[#101010]/50 text-center">
                If this takes more than a minute, keep this tab open.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
