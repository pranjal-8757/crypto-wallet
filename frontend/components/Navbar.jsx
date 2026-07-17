'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sun, Moon, Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Top header for the authenticated app shell.
 *
 * Primary navigation lives in Sidebar; this header only carries
 * global Search, the theme toggle, Notifications, and the Profile
 * menu -- plus the hamburger button that opens Sidebar's mobile
 * drawer (a required control, not app "content": without it there is
 * no way to reach navigation on screens below `md`, where Sidebar is
 * hidden).
 *
 * @param {() => void} onMenuClick - opens the mobile Sidebar drawer
 */
export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close the profile menu on outside click or Escape.
  useEffect(() => {
    if (!profileOpen) return;

    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          {/* Mobile drawer trigger -- Sidebar is hidden below `md` */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-card hover:text-text-primary transition-colors md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Search — hidden on small screens */}
          <div className="hidden flex-1 max-w-md md:block">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                id="global-search"
                type="search"
                placeholder="Search transactions, addresses…"
                className="input-field pl-9"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDark}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-card hover:text-text-primary transition-colors"
          >
            {mounted && isDark ? (
              <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-card hover:text-text-primary transition-colors"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
          </button>

          {/* Profile menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card-hover pl-1 pr-2 text-sm font-medium text-text-primary hover:border-border-hover transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-hover">
                JD
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="surface-card surface-glass animate-fade-up absolute right-0 top-11 w-52 rounded-lg p-1.5 shadow-lg"
              >
                <div className="px-3 py-2 text-xs text-text-secondary">Signed in as Jordan Davis</div>
                <Link
                  href="/settings"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-primary transition-colors"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  Account Settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
