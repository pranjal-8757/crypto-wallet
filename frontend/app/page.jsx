import Link from 'next/link';
import {
  Fingerprint,
  KeyRound,
  Grid3x3,
  ArrowRight,
  Lock,
  ServerCog,
  Eye,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const SECURITY_PILLARS = [
  {
    icon: Lock,
    title: 'Non-custodial by design',
    description:
      'Keys are generated and held inside secure enclaves via Turnkey — Vault itself never has access to your private key material.',
  },
  {
    icon: Eye,
    title: 'Independent verification layers',
    description:
      'Identity, custody, and intent are each checked separately, so a single compromised factor is never enough on its own.',
  },
  {
    icon: ServerCog,
    title: 'Policy-backed infrastructure',
    description:
      'Every signing request runs through Turnkey\u2019s policy engine before it can be approved, giving every action an auditable trail.',
  },
];

const FEATURES = [
  {
    icon: KeyRound,
    title: 'Embedded Wallets',
    description:
      'Your wallet lives inside the app, provisioned and secured by Turnkey — no browser extension, no seed phrase to lose.',
  },
  {
    icon: Fingerprint,
    title: 'Passkey Authentication',
    description:
      'Sign in with Face ID, Touch ID, or your device passkey. Nothing to type, nothing to phish.',
  },
  {
    icon: Grid3x3,
    title: 'Visual Password Security',
    description:
      'Before any high-value transfer signs, confirm a pattern only you know — a second layer standing between your keys and mistakes.',
  },
];

/**
 * Public marketing / landing page. No auth state is read here; the
 * "Sign In" action links to /login where passkey auth will live.
 */
export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="grid-motif relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-primary/10 via-transparent to-transparent"
          aria-hidden="true"
        />

        <Container size="lg" className="relative">
          <div className="grid gap-16 py-24 sm:py-28 lg:grid-cols-2 lg:items-center lg:py-32">
            {/* Copy */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                Built on Turnkey
              </span>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-[3.25rem]">
                A wallet that asks
                <br />
                before it signs.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
                Vault pairs Turnkey&apos;s embedded wallets and passkey login with a Visual
                Password — a pattern-based confirmation step that stands between your keys
                and every high-value transaction.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/login">
                  <Button size="lg" icon={<Fingerprint className="h-4 w-4" aria-hidden="true" />}>
                    Sign In
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  className="flex-row-reverse"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Signature visual: the Visual Password pattern grid */}
            <div className="animate-fade-up flex justify-center lg:justify-end" style={{ animationDelay: '100ms' }}>
              <PatternLockGraphic />
            </div>
          </div>
        </Container>
      </section>

      {/* Feature cards */}
      <section className="py-24 sm:py-28">
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Three layers, one wallet
            </h2>
            <p className="mt-3 text-text-secondary">
              Custody, identity, and intent — each verified independently before a
              transaction ever reaches the chain.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} interactive padding="lg" className="animate-fade-up">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                  <Icon className="h-5 w-5 text-primary-hover" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Security overview */}
      <section className="border-t border-border py-24 sm:py-28">
        <Container size="lg">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-text-secondary">
                <ShieldCheck className="h-3.5 w-3.5 text-primary-hover" aria-hidden="true" />
                Security overview
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Defense in depth, not just a passkey
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
                Most wallets stop at authentication. Vault treats sign-in as only the first
                checkpoint — every high-value transfer is independently verified again before it
                ever reaches the chain.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {SECURITY_PILLARS.map(({ icon: Icon, title, description }) => (
                <Card key={title} padding="lg" className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                    <Icon className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Turnkey integration */}
      <section className="border-t border-border bg-card-hover/40 py-24 sm:py-28">
        <Container size="lg">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <Card padding="lg" glass className="rounded-lg">
                <dl className="grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs text-text-secondary">Key custody</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-primary">
                      Secure enclave
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-secondary">Sign-in method</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-primary">Passkey</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-secondary">Recovery</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-primary">
                      Email + Visual Password
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-secondary">Networks</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-primary">
                      Ethereum, Arbitrum, Base
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-text-secondary">
                <KeyRound className="h-3.5 w-3.5 text-primary-hover" aria-hidden="true" />
                Powered by Turnkey
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Embedded wallets, without the trust trade-off
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                Vault is built on Turnkey&apos;s embedded wallet infrastructure. Wallets are
                provisioned inside secure enclaves, authenticated with passkeys, and every signing
                request runs through Turnkey&apos;s policy engine — so you get a seamless
                in-app experience without handing custody to a centralized party.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Visual Password -- coming soon */}
      <section className="border-t border-border py-24 sm:py-28">
        <Container size="lg">
          <Card padding="lg" className="grid-motif relative overflow-hidden lg:p-12">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-5">
              <Badge tone="warning">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Coming Soon
              </Badge>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                <Grid3x3 className="h-5 w-5 text-primary-hover" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Visual Password
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                A pattern-based confirmation step you set up once and recognize instantly — designed
                to catch address-swap and clipboard-hijack attempts before a transaction signs.
                Visual Password is currently in development and will roll out to all wallets soon.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      {/* Call to action */}
      <section className="border-t border-border py-24 sm:py-28">
        <Container size="md">
          <div className="rounded-lg border border-border bg-gradient-to-br from-primary/10 via-card to-card px-8 py-16 text-center shadow-md sm:px-16">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Ready to try a wallet that double-checks itself?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary sm:text-base">
              Sign in with a passkey and your embedded wallet is ready in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" icon={<Fingerprint className="h-4 w-4" aria-hidden="true" />}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <Container size="lg">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Fingerprint className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-text-primary">Vault</span>
            </div>
            <p className="text-xs text-text-secondary">
              &copy; {new Date().getFullYear()} Vault. Built on Turnkey embedded wallets.
            </p>
            <div className="flex items-center gap-5 text-xs text-text-secondary">
              <Link href="/login" className="hover:text-text-primary transition-colors">
                Sign In
              </Link>
              <span className="hover:text-text-primary transition-colors cursor-default">
                Privacy
              </span>
              <span className="hover:text-text-primary transition-colors cursor-default">
                Terms
              </span>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}

/**
 * A minimal 3x3 dot grid with a connecting path, illustrating the
 * Visual Password concept. This is the page's signature graphic — the
 * same dot motif reappears (quietly, as a background texture) across
 * empty states and the loading screen.
 */
function PatternLockGraphic() {
  const points = [
    [40, 40], [110, 40], [180, 40],
    [40, 110], [110, 110], [180, 110],
    [40, 180], [110, 180], [180, 180],
  ];
  const path = [0, 4, 2, 4, 6, 4, 8];
  const pathPoints = path.map((i) => points[i]);
  const pathD = pathPoints
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
    .join(' ');

  return (
    <div
      className="surface-card surface-glass rounded-lg p-10 shadow-lg"
      role="img"
      aria-label="Illustration of a Visual Password pattern connecting a grid of dots"
    >
      <svg viewBox="0 0 220 220" width="220" height="220" aria-hidden="true">
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {points.map(([x, y], i) => {
          const active = path.includes(i);
          return (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={active ? 7 : 5}
              fill={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
              stroke={active ? 'var(--color-secondary)' : 'none'}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
