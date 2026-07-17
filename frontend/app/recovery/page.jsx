'use client';

import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import RecoveryWizard from '@/components/recovery/RecoveryWizard';

export default function RecoveryPage() {
  const router = useRouter();

  return (
    <AppShell>
      <PageHeader
        title="Recovery"
        description="Lost access to your passkey? Verify your identity to register a new one."
      />
      <RecoveryWizard onDone={() => router.push('/dashboard')} />
    </AppShell>
  );
}
