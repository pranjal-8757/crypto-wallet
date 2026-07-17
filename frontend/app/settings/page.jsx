'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Wallet2,
  Fingerprint,
  ShieldQuestion,
  Grid3x3,
  Bell,
  Laptop,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import NetworkBadge from '@/components/NetworkBadge';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsRow from '@/components/settings/SettingsRow';
import { useTheme } from '@/hooks/useTheme';
import { wallet, passkeys, connectedDevices, sessions } from '@/lib/placeholder-data';
import { formatAddress, formatTimestamp } from '@/lib/format';

export default function SettingsPage() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState({
    email: true,
    transactions: true,
    security: true,
  });

  const updateNotification = (key) => (value) =>
    setNotifications((prev) => ({ ...prev, [key]: value }));

  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your account, wallet, and security preferences." />

      <div className="flex flex-col gap-6">
        {/* Account */}
        <SettingsSection icon={User} title="Account" description="Your Vault account details.">
          <SettingsRow label="Name" helperText="Displayed across the app">
            <span className="text-sm text-text-primary">Jordan Davis</span>
          </SettingsRow>
          <SettingsRow label="Email">
            <span className="text-sm text-text-primary">jordan@example.com</span>
          </SettingsRow>
          <SettingsRow label="Account status">
            <Badge tone="success">Active</Badge>
          </SettingsRow>
        </SettingsSection>

        {/* Wallet */}
        <SettingsSection icon={Wallet2} title="Wallet" description="Details about your embedded wallet.">
          <SettingsRow label="Address">
            <span className="font-mono-data text-sm text-text-primary">
              {formatAddress(wallet.address)}
            </span>
          </SettingsRow>
          <SettingsRow label="Network">
            <NetworkBadge network={wallet.network} />
          </SettingsRow>
          <SettingsRow label="Wallet type">
            <span className="text-sm text-text-primary">{wallet.type}</span>
          </SettingsRow>
        </SettingsSection>

        {/* Theme */}
        <SettingsSection
          icon={isDark ? Moon : Sun}
          title="Theme"
          description="Choose how Vault looks on this device."
        >
          <SettingsRow label="Dark mode" helperText="Switches instantly, no reload needed">
            <Toggle
              checked={mounted && isDark}
              onChange={toggleTheme}
              label="Toggle dark mode"
            />
          </SettingsRow>
        </SettingsSection>

        {/* Passkeys */}
        <SettingsSection
          icon={Fingerprint}
          title="Passkeys"
          description="Devices authorized to sign in with a passkey."
        >
          {passkeys.map((passkey) => (
            <SettingsRow
              key={passkey.id}
              label={passkey.label}
              helperText={`Added ${formatTimestamp(passkey.createdAt)}`}
            >
              <div className="flex items-center gap-2">
                {passkey.current && <Badge tone="success">Current</Badge>}
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </SettingsRow>
          ))}
          <Button variant="secondary" size="sm" className="self-start">
            Add Passkey
          </Button>
        </SettingsSection>

        {/* Recovery */}
        <SettingsSection
          icon={ShieldQuestion}
          title="Recovery"
          description="Regain access if you lose your passkey."
        >
          <SettingsRow label="Recovery method" helperText="Email + Visual Password">
            <Badge tone="success">Configured</Badge>
          </SettingsRow>
          <Link href="/recovery">
            <Button variant="secondary" size="sm">
              Go to Recovery
            </Button>
          </Link>
        </SettingsSection>

        {/* Visual Password */}
        <SettingsSection
          icon={Grid3x3}
          title="Visual Password"
          description="The extra verification layer required before sensitive transfers."
        >
          <SettingsRow label="Status" helperText="Required for high-value transfers">
            <Badge tone="warning">Not Configured</Badge>
          </SettingsRow>
          <Button size="sm" className="self-start">
            Set Up Visual Password
          </Button>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={Bell} title="Notifications" description="Choose what Vault emails and alerts you about.">
          <SettingsRow label="Email notifications" helperText="Product updates and announcements">
            <Toggle
              checked={notifications.email}
              onChange={updateNotification('email')}
              label="Toggle email notifications"
            />
          </SettingsRow>
          <SettingsRow label="Transaction alerts" helperText="Sent and received transfers">
            <Toggle
              checked={notifications.transactions}
              onChange={updateNotification('transactions')}
              label="Toggle transaction alerts"
            />
          </SettingsRow>
          <SettingsRow label="Security alerts" helperText="New devices and sign-ins">
            <Toggle
              checked={notifications.security}
              onChange={updateNotification('security')}
              label="Toggle security alerts"
            />
          </SettingsRow>
        </SettingsSection>

        {/* Connected Devices */}
        <SettingsSection icon={Laptop} title="Connected Devices" description="Devices that have signed in to your account.">
          {connectedDevices.map((device) => (
            <SettingsRow
              key={device.id}
              label={device.label}
              helperText={`${device.location} · Last active ${formatTimestamp(device.lastActive)}`}
            >
              <div className="flex items-center gap-2">
                {device.current && <Badge tone="success">This device</Badge>}
                {!device.current && (
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                )}
              </div>
            </SettingsRow>
          ))}
        </SettingsSection>

        {/* Security */}
        <SettingsSection icon={ShieldCheck} title="Security" description="Overall security posture for this account.">
          <SettingsRow label="Passkey authentication">
            <Badge tone="success">Active</Badge>
          </SettingsRow>
          <SettingsRow label="Visual Password">
            <Badge tone="warning">Pending</Badge>
          </SettingsRow>
          <SettingsRow label="Recovery method">
            <Badge tone="success">Active</Badge>
          </SettingsRow>
        </SettingsSection>

        {/* Sessions */}
        <SettingsSection icon={Clock} title="Sessions" description="Where you're currently signed in.">
          {sessions.map((session) => (
            <SettingsRow
              key={session.id}
              label={session.device}
              helperText={`Started ${formatTimestamp(session.startedAt)}`}
            >
              <div className="flex items-center gap-2">
                {session.current ? (
                  <Badge tone="success">Current</Badge>
                ) : (
                  <Button variant="ghost" size="sm">
                    End Session
                  </Button>
                )}
              </div>
            </SettingsRow>
          ))}
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection
          icon={AlertTriangle}
          title="Danger Zone"
          description="Irreversible actions -- proceed with caution."
          tone="danger"
        >
          <SettingsRow label="Deactivate wallet" helperText="Temporarily disable this wallet">
            <Button variant="danger" size="sm">
              Deactivate
            </Button>
          </SettingsRow>
          <SettingsRow label="Delete account" helperText="Permanently remove your Vault account">
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </SettingsRow>
        </SettingsSection>
      </div>
    </AppShell>
  );
}
