'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import Pagination from '@/components/ui/Pagination';
import HistoryFilter from '@/components/HistoryFilter';
import TransactionTable from '@/components/TransactionTable';
import TransactionDetailsModal from '@/components/TransactionDetailsModal';
import { transactions } from '@/lib/placeholder-data';
import { paginate, getPageCount } from '@/utils/transactionHelpers';

const DATE_RANGE_DAYS = {
  'All Time': null,
  'Last 7 Days': 7,
  'Last 30 Days': 30,
  'Last 90 Days': 90,
};

const DEFAULT_FILTERS = {
  search: '',
  type: 'All Types',
  status: 'All Statuses',
  date: 'All Time',
  network: 'All Networks',
};

const PAGE_SIZE = 5;

export default function HistoryPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const days = DATE_RANGE_DAYS[filters.date];
    const cutoff = days ? Date.now() - days * 24 * 60 * 60 * 1000 : null;

    return transactions.filter((tx) => {
      if (filters.type !== 'All Types' && tx.type !== filters.type.toLowerCase()) return false;
      if (filters.status !== 'All Statuses' && tx.status !== filters.status.toLowerCase()) return false;
      if (filters.network !== 'All Networks' && tx.network !== filters.network) return false;
      if (cutoff && new Date(tx.timestamp).getTime() < cutoff) return false;
      if (
        search &&
        !tx.counterparty.toLowerCase().includes(search) &&
        !tx.hash.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const pageCount = getPageCount(filtered.length, PAGE_SIZE);
  const pageItems = paginate(filtered, page, PAGE_SIZE);

  const handleFiltersChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <AppShell>
      <PageHeader
        title="Transaction History"
        description="Every transfer in or out of this wallet, on-chain and in order."
      />

      <div className="flex flex-col gap-6">
        <HistoryFilter filters={filters} onChange={handleFiltersChange} />
        <TransactionTable transactions={pageItems} onSelect={setSelectedTx} />
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>

      <TransactionDetailsModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </AppShell>
  );
}
