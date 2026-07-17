# Crypto Wallet Backend

Orchestration backend for a Turnkey-powered crypto wallet.

```
Frontend  →  Backend  →  Turnkey  →  Ethereum
```

Turnkey Wallet-as-a-Service already handles passkey authentication,
embedded wallets, private key management, transaction signing, and
wallet recovery. **This backend does not replace any of that.** It
exists to:

- Persist local records (users, wallets, transactions, recovery
  attempts) that reference Turnkey's identifiers
- Issue and verify its own session tokens once a user has already
  authenticated with Turnkey on the client
- Act as the orchestration layer that will, in a later phase, sit
  between the frontend and Turnkey

An independent **Visual Password SDK** module will eventually plug in
between this backend and Turnkey, adding a verification step before
sensitive operations (transfers, recovery) are handed off for
signing:

```
Frontend  →  Backend  →  Visual Password SDK  →  Turnkey  →  Ethereum
```

This phase only prepares the architecture for that integration
(`models/Challenge.js`, `models/VerificationToken.js`,
`routes/sdk.js`, `controllers/sdkController.js`). No challenge
generation, verification, or token logic is implemented yet.

## Architecture

MVC, with business logic pushed down into services:

```
routes/        → only wire HTTP verbs + paths to controller functions
controllers/   → thin: parse request, call a service, shape response
services/      → business logic (currently placeholders/stubs)
models/        → Mongoose schemas
middleware/    → auth guard, 404, centralized error handler
config/        → env-driven config (db, jwt, turnkey)
utils/         → logger, generic crypto helpers, async/error helpers
```

Every controller and route is fully wired end-to-end, but the actual
business logic (in `services/`) and most controller bodies are
intentionally unimplemented (`501 Not Implemented` stubs or functions
that throw a documented "not implemented yet" error) — this phase is
the foundation, not the feature set.

## What's explicitly NOT implemented yet

- Turnkey API calls (wallet creation, signing, recovery)
- Transaction signing / blockchain submission
- Recovery business logic
- Visual Password SDK (challenge generation, verification, tokens)
- OTP delivery/validation
- Passkey/WebAuthn logic

All of the above are represented only as schemas, route stubs, or
documented function signatures that throw when called, so the shape
of the system is in place ahead of the real integrations.

## Project structure

```
backend/
├── config/
│   ├── db.js            MongoDB connection
│   ├── turnkey.js        Turnkey config (env-driven, no API calls)
│   └── jwt.js             JWT signing/verification utilities
├── controllers/           Thin request handlers (mostly 501 stubs)
├── middleware/
│   ├── authMiddleware.js  Verifies this backend's own JWT
│   ├── errorHandler.js    Centralized error handling
│   └── notFound.js        404 handler
├── models/                Mongoose schemas (User, Wallet, Transaction,
│                           Challenge, Recovery, VerificationToken)
├── routes/                Express routers, one per domain
├── services/               Business logic (placeholder functions)
├── utils/
│   ├── logger.js           Minimal timestamped logger
│   ├── crypto.js            Generic random ID / token / hash helpers
│   └── helpers.js           asyncHandler, ApiError, response helper
├── app.js                   Express app (middleware + route registration)
├── server.js                 Entry point (connects DB, starts server)
├── package.json
├── .env.example
└── README.md
```

## Getting started

```bash
cp .env.example .env    # then fill in MONGO_URI, JWT secrets, etc.
npm install
npm run dev              # nodemon
# or
npm start
```

`GET /health` returns `{ success: true, message: "Backend is running" }`
once the server and MongoDB connection are both up.

## API surface (all currently stubbed)

| Method | Path                                   | Notes                                   |
|--------|-----------------------------------------|------------------------------------------|
| POST   | /api/auth/register                      |                                            |
| POST   | /api/auth/login                         |                                            |
| POST   | /api/auth/refresh                       |                                            |
| POST   | /api/auth/logout                        |                                            |
| GET    | /api/auth/me                            | protected                                  |
| GET    | /api/wallet                              | protected                                  |
| GET    | /api/wallet/balance                      | protected                                  |
| POST   | /api/transactions                        | protected — prepares, does not sign        |
| GET    | /api/transactions                        | protected                                  |
| GET    | /api/transactions/:id                    | protected                                  |
| POST   | /api/recovery/start                      | public — for locked-out users              |
| POST   | /api/recovery/verify-email               | public                                     |
| POST   | /api/recovery/verify-visual-password     | public                                     |
| POST   | /api/recovery/create-passkey             | public                                     |
| POST   | /api/sdk/challenge/start                 | protected — reserved for Visual Password SDK |
| POST   | /api/sdk/challenge/verify                | protected — reserved for Visual Password SDK |
| POST   | /api/sdk/challenge/cancel                | protected — reserved for Visual Password SDK |

## Next steps (future phases, not in this one)

1. Implement `services/*` business logic against the models above
2. Wire `services/turnkeyService.js` to real Turnkey API calls
3. Integrate the Visual Password SDK behind `routes/sdk.js`
4. Implement OTP delivery for recovery email verification
5. Add request validation (e.g. a schema-validation middleware layer)
