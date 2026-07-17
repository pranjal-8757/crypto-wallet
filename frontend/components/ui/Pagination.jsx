'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Simple prev/next + page-number pagination control.
 *
 * @param {number} page - current 1-indexed page
 * @param {number} pageCount
 * @param {(next: number) => void} onChange
 */
export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Pagination">
      <p className="text-xs text-text-secondary">
        Page {page} of {pageCount}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
              p === page
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
