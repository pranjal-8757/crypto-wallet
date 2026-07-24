'use client';

import { ShieldQuestion, ArrowRight, Fingerprint } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import RecoverySteps from './RecoverySteps';
import SecurityTimeline from './SecurityTimeline';
import EmailInput from './EmailInput';
import OTPInput from './OTPInput';
import RecoveryComplete from './RecoveryComplete';
import RecoveryFailed from './RecoveryFailed';
import { useRecovery } from '@/hooks/useRecovery';

/**
 * Full passkey-recovery wizard: Start -> Email -> OTP -> Visual
 * Password -> Register New Passkey -> Complete.
 *
 * All state is local (useRecovery). No Turnkey or backend calls are
 * made -- registering the actual new passkey happens via Turnkey once
 * that integration exists.
 *
 * This is the Visual Password SDK's own surface (passkey recovery is
 * one of its two features), so it renders in the calm, warm
 * white/orange "security verification" theme (see `.vp-theme` in
 * app/globals.css) rather than the dark dashboard -- even though it's
 * embedded inside the dark Recovery page shell (Sidebar/Navbar stay
 * dark; only this wizard card switches theme).
 */
export default function RecoveryWizard({ onDone }) {
  const recovery = useRecovery();
  const {
    step,
    stepIndex,
    steps,
    status,
    email,
    setEmail,
    otp,
    setOtp,
    goNext,
    goBack,
    reset,
    submitEmail,
    submitOtp,
    message,
  } = recovery;

  const renderStep = () => {
    switch (step) {
      case 'start':
        return (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <ShieldQuestion className="h-8 w-8 text-[var(--vp-primary-hover)]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--vp-text-primary)]">Recover Your Wallet</h3>
              <p className="mt-2 max-w-sm text-base leading-relaxed text-[var(--vp-text-secondary)]">
                Lost access to your passkey? We&apos;ll verify your identity in a few steps and
                help you register a new one.
              </p>
            </div>
            <Button
              theme="light"
              onClick={goNext}
              icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              className="mt-2 flex-row-reverse"
            >
              Start Recovery
            </Button>
          </div>
        );

      case 'email':
        return (
          <><EmailInput
            value={email}
            onChange={setEmail}
            onContinue={submitEmail}
            loading={status === 'verifying'}
          />{message && <p className={`mt-3 text-sm ${status === 'failed' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}</>
        );

      case 'otp':
        if (status === 'failed') {
          return <RecoveryFailed onRetry={() => setOtp('')} onCancel={onDone} />;
        }
        return (
          <OTPInput
            value={otp}
            onChange={setOtp}
            onContinue={submitOtp}
            onBack={goBack}
            status={status}
          />
        );

      case 'visual-password':
        return <div className="flex flex-col gap-3 py-8 text-center"><h3 className="text-xl font-bold text-[var(--vp-text-primary)]">Email verified</h3><p className="text-base text-[var(--vp-text-secondary)]">Visual Password verification will be available in the next recovery step.</p></div>;

      case 'new-passkey':
        return (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <Fingerprint className="h-8 w-8 text-[var(--vp-primary-hover)]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--vp-text-primary)]">
                Ready to Register a New Passkey
              </h3>
              <p className="mt-2 max-w-sm text-base leading-relaxed text-[var(--vp-text-secondary)]">
                Everything checks out. Your device will prompt you to create a new passkey via
                Turnkey next.
              </p>
            </div>
            <Button theme="light" onClick={goNext} className="mt-2">
              Register New Passkey
            </Button>
          </div>
        );

      case 'complete':
      default:
        return <RecoveryComplete onDone={onDone} />;
    }
  };

  const showChrome = step !== 'complete';

  return (
    <div className="vp-theme rounded-[28px] p-4 sm:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card theme="light" padding="lg" className="lg:col-span-2">
          {showChrome && (
            <div className="mb-7">
              <RecoverySteps steps={steps} currentIndex={stepIndex} />
            </div>
          )}
          {renderStep()}
        </Card>

        {showChrome && (
          <div className="flex flex-col gap-4">
            <SecurityTimeline currentStep={step} />
            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-medium text-[var(--vp-text-secondary)] hover:text-[var(--vp-primary-hover)] transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
