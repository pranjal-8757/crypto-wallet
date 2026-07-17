'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react';
import Card from './ui/Card';

/**
 * Row of primary dashboard actions. Send/Receive navigate to their
 * respective pages; Copy Address copies inline without navigating.
 */
export default function QuickActions({ address }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures -- non-critical UI feedback only.
    }
  };

  const actions = [
    { label: 'Receive', icon: ArrowDownLeft, href: '/receive' },
    { label: 'Send', icon: ArrowUpRight, href: '/send' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map(({ label, icon: Icon, href }) => (
        <Link key={label} href={href} className="block">
          <Card
            interactive
            padding="md"
            className="flex flex-col items-center justify-center gap-2 py-6 text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Icon className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-text-primary">{label}</span>
          </Card>
        </Link>
      ))}

      <button type="button" onClick={handleCopy} className="block w-full text-left">
        <Card
          interactive
          padding="md"
          className="flex w-full flex-col items-center justify-center gap-2 py-6 text-center"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card-hover border border-border">
            {copied ? (
              <Check className="h-4.5 w-4.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="h-4.5 w-4.5 text-text-secondary" aria-hidden="true" />
            )}
          </div>
          <span className="text-sm font-medium text-text-primary">
            {copied ? 'Copied' : 'Copy Address'}
          </span>
        </Card>
      </button>
    </div>
  );
}
