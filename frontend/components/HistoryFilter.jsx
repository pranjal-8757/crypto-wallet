'use client';

import { Search } from 'lucide-react';

const TYPE_OPTIONS = ['All Types', 'Sent', 'Received'];
const STATUS_OPTIONS = ['All Statuses', 'Completed', 'Pending', 'Failed'];
const DATE_OPTIONS = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];
const NETWORK_OPTIONS = ['All Networks', 'Ethereum Sepolia', 'Arbitrum Sepolia', 'Base Sepolia'];

/**
 * Controlled filter bar for transaction history: search, type, status,
 * network, and date range. All filtering happens client-side against
 * the placeholder transaction list.
 *
 * @param {{search: string, type: string, status: string, date: string, network: string}} filters
 * @param {(next: object) => void} onChange
 */
export default function HistoryFilter({ filters, onChange }) {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <label htmlFor="history-search" className="sr-only">
          Search transactions
        </label>
        <input
          id="history-search"
          type="search"
          placeholder="Search by address or hash…"
          value={filters.search}
          onChange={update('search')}
          className="input-field pl-9"
        />
      </div>

      <div className="flex gap-3">
        <label htmlFor="history-date" className="sr-only">
          Filter by date
        </label>
        <select id="history-date" value={filters.date} onChange={update('date')} className="input-field w-auto">
          {DATE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="history-network" className="sr-only">
          Filter by network
        </label>
        <select id="history-network" value={filters.network} onChange={update('network')} className="input-field w-auto">
          {NETWORK_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="history-type" className="sr-only">
          Filter by type
        </label>
        <select id="history-type" value={filters.type} onChange={update('type')} className="input-field w-auto">
          {TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="history-status" className="sr-only">
          Filter by status
        </label>
        <select id="history-status" value={filters.status} onChange={update('status')} className="input-field w-auto">
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
