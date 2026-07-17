'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  ShieldQuestion,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Wallet', href: '/wallet', icon: Wallet },
  { label: 'Send', href: '/send', icon: ArrowUpRight },
  { label: 'Receive', href: '/receive', icon: ArrowDownLeft },
  { label: 'History', href: '/history', icon: History },
  { label: 'Recovery', href: '/recovery', icon: ShieldQuestion },
  { label: 'Settings', href: '/settings', icon: Settings },
];

/**
 * Primary app navigation, rendered as a permanent left sidebar.
 *
 * - Desktop (`lg`+): fixed, always full width -- not collapsible.
 * - Tablet (`md`-`lg`): same sidebar, collapsible to an icon-only
 *   rail via the chevron toggle at the bottom.
 * - Mobile (below `md`): hidden by default; opens as a slide-in
 *   drawer with backdrop, triggered by Navbar's hamburger button.
 *
 * @param {boolean} mobileOpen
 * @param {() => void} onMobileClose
 */
export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Desktop is always fully expanded regardless of the tablet collapse
  // toggle -- track viewport so `collapsed` only ever takes effect on
  // tablet-sized screens.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const effectiveCollapsed = collapsed && !isDesktop;
  const showLabels = !effectiveCollapsed;

  const renderContent = ({ withCollapseToggle }) => (
    <>
      <div className={`flex items-center gap-2.5 px-1 pb-6 ${showLabels ? '' : 'justify-center'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
          <ShieldCheck className="h-4.5 w-4.5 text-white" aria-hidden="true" />
        </div>
        {showLabels && (
          <span className="font-display text-base font-semibold tracking-tight text-text-primary">
            Vault
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              title={showLabels ? undefined : label}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                showLabels ? '' : 'justify-center'
              } ${
                isActive
                  ? 'bg-primary/10 text-primary-hover border border-primary/30'
                  : 'text-text-secondary border border-transparent hover:bg-card hover:text-text-primary'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive ? 'text-primary-hover' : 'text-text-muted group-hover:text-text-primary'
                }`}
                aria-hidden="true"
              />
              {showLabels && label}
            </Link>
          );
        })}
      </nav>

      <div className="my-3 border-t border-border" aria-hidden="true" />

      <button
        type="button"
        title={showLabels ? undefined : 'Logout'}
        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors ${
          showLabels ? '' : 'justify-center'
        }`}
      >
        <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        {showLabels && 'Logout'}
      </button>

      {withCollapseToggle && (
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={showLabels ? 'Collapse sidebar' : 'Expand sidebar'}
          className="mt-3 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-xs font-medium text-text-secondary hover:bg-card hover:text-text-primary transition-colors"
        >
          {showLabels ? (
            <>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Collapse
            </>
          ) : (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop (fixed) + tablet (collapsible) rail */}
      <aside
        className={`hidden md:flex md:flex-col md:shrink-0 border-r border-border bg-bg min-h-screen px-4 py-6 transition-all duration-200 ${
          effectiveCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {renderContent({ withCollapseToggle: !isDesktop })}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 animate-fade-up"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="surface-card animate-fade-up relative flex h-full w-72 max-w-[80vw] flex-col border-r border-border bg-bg px-4 py-6">
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close navigation menu"
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-card hover:text-text-primary transition-colors"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
            {renderContent({ withCollapseToggle: false })}
          </aside>
        </div>
      )}
    </>
  );
}
