import Loading from './Loading';

/**
 * Marks where a page requires an authenticated Turnkey session.
 *
 * This is a structural placeholder only: it does NOT perform any
 * authentication check yet. Once the Turnkey session/auth context is
 * wired up in a later phase, this component will:
 *   1. Read session state from an auth context/hook
 *   2. Render <Loading /> while that state resolves
 *   3. Redirect unauthenticated users to /login
 *   4. Render `children` once a session is confirmed
 *
 * Usage (future):
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  // Placeholder pass-through. No auth logic is implemented here yet.
  const isSessionLoading = false;

  if (isSessionLoading) {
    return <Loading label="Checking your session…" />;
  }

  return <>{children}</>;
}
