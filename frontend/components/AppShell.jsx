'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';
import Container from './ui/Container';

/**
 * Shared shell for authenticated wallet pages (Dashboard, Wallet, Send,
 * Receive, History, Recovery, Settings, ...). Wraps content in
 * ProtectedRoute so the gating logic added in a later phase only
 * needs to be wired in one place.
 *
 * Layout: a permanent left Sidebar (fixed on desktop, collapsible on
 * tablet, a drawer on mobile) alongside a top Navbar (search, theme
 * toggle, notifications, profile) and the page content below it.
 */
export default function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-bg">
        <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setMobileNavOpen(true)} />
          <main className="flex-1 py-6 sm:py-8">
            <Container size="xl">{children}</Container>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
