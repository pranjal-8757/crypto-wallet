import './globals.css';
import '@turnkey/react-wallet-kit/styles.css';
import Providers from "./providers";

export const metadata = {
  title: 'Vault — Secure Embedded Crypto Wallet',
  description:
    'A premium embedded crypto wallet secured by passkeys and Visual Password verification.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffdf8' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0d' },
  ],
};

// Applied synchronously before hydration so the stored theme choice
// (see hooks/useTheme.js) takes effect before first paint -- avoids a
// flash of the wrong theme. Light is the default when nothing is
// stored yet.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('vault-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

/**
 * Root layout.
 *
 * This is intentionally minimal at this stage: it only establishes the
 * document shell, global fonts/styles, and base background. Route groups
 * (e.g. an authenticated app shell with Navbar + Sidebar) will compose
 * on top of this once auth and routing land in a later phase.
 */
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
                <Providers>

                    {children}

                </Providers>
            </body>
        </html>
    );
}
