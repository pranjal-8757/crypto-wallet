"use client";

import { TurnkeyProvider } from "@turnkey/react-wallet-kit";

const turnkeyConfig = {
    organizationId:
        process.env.NEXT_PUBLIC_ORGANIZATION_ID,

    authProxyConfigId:
        process.env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID,
};

export default function Providers({ children }) {
    return (
        <TurnkeyProvider
            config={turnkeyConfig}
            callbacks={{
                onError(error) {
                    console.error(error);
                },
            }}
        >
            {children}
        </TurnkeyProvider>
    );
}