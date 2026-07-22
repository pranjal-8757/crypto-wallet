'use client';

import { useEffect, useRef, useState } from 'react';
import { Wallet2, TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { useTurnkey } from '@turnkey/react-wallet-kit';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import WalletSummary from '@/components/WalletSummary';
import QuickActions from '@/components/QuickActions';
import RecentTransactions from '@/components/RecentTransactions';
import SecurityCard from '@/components/SecurityCard';
import StatsCard from '@/components/StatsCard';
import ActivityChart from '@/components/ActivityChart';
import { transactions, securityStatus, walletEvents, marketOverview, portfolioHistory } from '@/lib/placeholder-data';
import { formatTimestamp } from '@/lib/format';
import { authenticatedFetch } from '@/lib/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const NETWORK = 'Ethereum Sepolia';
const EMPTY_BALANCE = { balance: '0', symbol: 'ETH', network: NETWORK };
const TREND_TONE = { up: 'success', down: 'danger', flat: 'default' };

function ethereumAddress(wallet) {
  return wallet?.accounts?.find((account) => account.addressFormat === 'ADDRESS_FORMAT_ETHEREUM')?.address;
}

export default function DashboardPage() {
  const initialized = useRef(false);
  const { session, fetchWallets, createWallet, createWalletAccounts } = useTurnkey();
  const [wallet, setWallet] = useState(null);
  const [walletError, setWalletError] = useState('');
  const [balance, setBalance] = useState(EMPTY_BALANCE);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  useEffect(() => {
    if (!session?.organizationId || initialized.current) return;

    initialized.current = true;

    const initializeWallet = async () => {
      try {
        setWalletError('');
        let wallets = await fetchWallets();

        let embeddedWallet = wallets.find((item) => ethereumAddress(item));

        if (!embeddedWallet) {
          const walletId = await createWallet({
            walletName: 'Vault Embedded Wallet',
            accounts: [],
            organizationId: session.organizationId,
          });

          await createWalletAccounts({
            walletId,
            accounts: ['ADDRESS_FORMAT_ETHEREUM'],
            organizationId: session.organizationId,
          });

          wallets = await fetchWallets();
          embeddedWallet = wallets.find((item) => item.walletId === walletId);
        }

        const walletAddress = ethereumAddress(embeddedWallet);
        if (!embeddedWallet?.walletId || !walletAddress) throw new Error('Turnkey did not return an Ethereum wallet account.');

        const response = await authenticatedFetch('/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: embeddedWallet.walletId, walletAddress }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || 'Unable to save wallet metadata.');

        setWallet(payload.wallet);
      } catch (error) {
        setWalletError(error.message || 'Unable to load your wallet.');
      }
    };

    initializeWallet();
  }, [session?.organizationId]);

  useEffect(() => {
    if (!wallet?.walletId) return;

    let cancelled = false;

    const loadBalance = async () => {
      setIsBalanceLoading(true);

      try {
        const response = await authenticatedFetch('/api/wallet/balance');
        const payload = await response.json().catch(() => ({}));
        const walletBalance = payload.balance;

        if (!response.ok || !walletBalance || typeof walletBalance.balance !== 'string') {
          if (!cancelled) setBalance(EMPTY_BALANCE);
          return;
        }

        if (!cancelled) {
          setBalance({
            balance: walletBalance.balance,
            symbol: walletBalance.symbol || 'ETH',
            network: walletBalance.network || NETWORK,
          });
        }
      } catch {
        if (!cancelled) setBalance(EMPTY_BALANCE);
      } finally {
        if (!cancelled) setIsBalanceLoading(false);
      }
    };

    loadBalance();

    return () => {
      cancelled = true;
    };
  }, [wallet?.walletId]);

  return (
    <AppShell>
      <PageHeader title="Welcome back" description="Here's what's happening with your wallet today." />
      {walletError && <p role="alert" className="mb-4 text-sm text-danger">{walletError}</p>}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {wallet ? <WalletSummary address={wallet.walletAddress} walletId={wallet.walletId} network={balance.network} balance={balance.balance} symbol={balance.symbol} isBalanceLoading={isBalanceLoading} /> : <Card padding="lg"><p className="text-sm text-text-secondary">Loading your embedded wallet…</p></Card>}
          <QuickActions address={wallet?.walletAddress || ''} />
          <div className="grid gap-4 sm:grid-cols-4"><StatsCard icon={Wallet2} label="Balance" value={isBalanceLoading ? 'Loading…' : `${balance.balance} ${balance.symbol}`} /><StatsCard icon={TrendingUp} label="Network" value={balance.network} /><StatsCard icon={TrendingUp} label="24h Change" value="—" /><StatsCard icon={Clock} label="Pending" value="—" /></div>
          <ActivityChart data={portfolioHistory} label="Activity Overview" rangeLabel="Last 14 days" />
          <div><h2 className="mb-4 text-base font-semibold text-text-primary">Recent Transactions</h2><RecentTransactions transactions={transactions} limit={4} /></div>
        </div>
        <div className="flex flex-col gap-6">
          <SecurityCard status={securityStatus} />
          <Card padding="lg"><div className="flex items-center gap-2.5"><TrendingUp className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" /><h3 className="text-base font-semibold text-text-primary">Market Overview</h3></div><ul className="mt-5 flex flex-col gap-4">{marketOverview.map((asset) => <li key={asset.symbol} className="flex items-center justify-between"><div><p className="text-sm font-medium text-text-primary">{asset.symbol}</p><p className="text-xs text-text-secondary">{asset.name}</p></div><div className="text-right"><p className="font-mono-data text-sm text-text-primary">${asset.price}</p><Badge tone={TREND_TONE[asset.trend]} className="mt-1">{asset.change}</Badge></div></li>)}</ul></Card>
          <Card padding="lg"><div className="flex items-center gap-2.5"><ShieldCheck className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" /><h3 className="text-base font-semibold text-text-primary">Latest Wallet Events</h3></div><ul className="mt-5 flex flex-col gap-4">{walletEvents.map((event) => <li key={event.id} className="flex items-start justify-between gap-3"><p className="text-sm text-text-secondary">{event.label}</p><p className="shrink-0 text-xs text-text-muted">{formatTimestamp(event.timestamp)}</p></li>)}</ul></Card>
        </div>
      </div>
    </AppShell>
  );
}
