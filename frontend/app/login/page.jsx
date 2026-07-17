"use client";

import { useEffect, useRef, useState } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { Fingerprint, ShieldCheck, KeyRound, Grid3x3 } from "lucide-react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const HIGHLIGHTS = [
  {
    icon: Fingerprint,
    title: "Passkey sign-in",
    description: "Face ID, Touch ID, or your device passkey â€” nothing to type or phish.",
  },
  {
    icon: KeyRound,
    title: "Embedded, non-custodial",
    description: "Keys are provisioned and secured by Turnkey inside a secure enclave.",
  },
  {
    icon: Grid3x3,
    title: "Visual Password",
    description: "A pattern-based check that stands between your keys and every transfer.",
  },
];

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LoginPage() {
  const turnkey = useTurnkey();  
  const router = useRouter();
  const submittedSession = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
    if (turnkey.clientState !== "ready") return;
    if (!turnkey.user) return;
    if (!turnkey.session) return;

    const key =
        turnkey.user.userId +
        ":" +
        turnkey.session.organizationId;

    if (submittedSession.current === key) return;

    submittedSession.current = key;

    createBackendSession();

}, [
    turnkey.clientState,
    turnkey.user,
    turnkey.session,
]);

  async function login() {
  try {
    setLoading(true);
    setError("");

    await turnkey.handleLogin();

  } catch (err) {
    console.error(err);
    setError(err.message);
    setLoading(false);
  }
}

async function createBackendSession() {
  try {
    console.log("Turnkey User:", turnkey.user);

    console.log("Sending:", {
      turnkeyUserId: turnkey.user.userId,
      email: turnkey.user.userEmail,
      organizationId: turnkey.session.organizationId,
    });
    const response = await fetch(
      `${backendUrl}/api/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        turnkeyUserId: turnkey.user.userId,
        organizationId: turnkey.session.organizationId,
        email:
          turnkey.user.userEmail ||
          turnkey.user.email ||
          turnkey.user.userEmailAddress ||
          undefined,
      }),
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message);
    }

    localStorage.setItem(
      "accessToken",
      payload.accessToken
    );

    router.push("/dashboard");

  } catch (err) {
    console.error(err);
  }
}
  /*async function login() {
  try {
    setLoading(true);
    setError("");

    // Authenticate with Turnkey
    await handleLogin();

    // Fetch the authenticated user from the Wallet Kit
    const user = await fetchUser();
    // console.log(user);
    console.log(JSON.stringify(user, null, 2));

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        turnkeyUserId: user.userId,
        organizationId: user.organizationId,
        email:
          user.userEmail ||
          user.email ||
          user.emails?.[0]?.emailAddress ||
          "",
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "Backend login failed.");
    }

    localStorage.setItem("accessToken", payload.accessToken);

    router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }*/

  return (
    <main className="grid-motif relative min-h-screen overflow-hidden bg-bg lg:grid lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary/10 via-transparent to-transparent lg:hidden" aria-hidden="true" />

      <div className="relative hidden flex-col justify-center border-r border-border bg-card-hover/40 px-16 py-24 lg:flex">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-text-secondary"><span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />Built on Turnkey</span>
        <h2 className="mt-6 max-w-sm text-3xl font-semibold leading-[1.15] tracking-tight text-text-primary">A wallet that asks before it signs.</h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">Embedded, passkey-secured, and backed by a second verification layer for every high-value transfer.</p>
        <div className="mt-12 flex flex-col gap-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20"><Icon className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" /></div><div><p className="text-sm font-semibold text-text-primary">{title}</p><p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p></div></div>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
        <Container size="sm" className="px-0"><Card padding="lg" className="animate-fade-up text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><ShieldCheck className="h-8 w-8 text-primary" /></div><h1 className="mt-6 text-3xl font-bold">Welcome to Vault</h1><p className="mt-3 text-text-secondary">Sign in securely using your Turnkey Passkey.</p>{error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}<Button className="mt-8 w-full" size="lg" onClick={login} disabled={loading} icon={<Fingerprint className="h-4 w-4" />}>{loading ? "Signing in..." : "Continue with Passkey"}</Button></Card></Container>
      </div>
    </main>
  );
}
