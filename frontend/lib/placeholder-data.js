/**
 * Static placeholder data for the wallet UI. Nothing here is fetched
 * or persisted -- once the backend and Turnkey integration land, these
 * exports get replaced by real API/session data.
 */

export const wallet = {
  address: '0xD3A74F95A8CE34B92A61FE9B7ACD49D58B4A92EF',
  id: 'twk-8f3e2a1c-4b7d-4e21-9c3a-1f2b3c4d5e6f',
  type: 'Embedded Wallet',
  network: 'Ethereum Sepolia',
  balanceEth: '5.247',
  balanceUsd: '18,240.35',
  pendingEth: '0.032',
  pendingUsd: '111.86',
};

export const assets = [
  { symbol: 'ETH', name: 'Ethereum', balance: '5.247', usdValue: '18,240.35', change: '+2.4%', trend: 'up' },
  { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00', usdValue: '1,250.00', change: '0.0%', trend: 'flat' },
  { symbol: 'ARB', name: 'Arbitrum', balance: '340.12', usdValue: '512.90', change: '-1.1%', trend: 'down' },
];

export const transactions = [
  {
    id: 'tx-1',
    type: 'received',
    status: 'completed',
    counterparty: '0x9F2b1A4e77Cc3D8a5E6f7B0c1D2e3F4a5B6c7D8e',
    amount: '0.842',
    symbol: 'ETH',
    usdValue: '2,932.14',
    network: 'Ethereum Sepolia',
    hash: '0x8e2f4a91b7c3d6e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c291cd',
    timestamp: '2026-07-09T14:32:00Z',
    gasFee: '0.0018 ETH',
  },
  {
    id: 'tx-2',
    type: 'sent',
    status: 'completed',
    counterparty: '0x4C1a8B2e9D3f6A7b8C9d0E1f2A3b4C5d6E7f8A9b',
    amount: '1.200',
    symbol: 'ETH',
    usdValue: '4,176.60',
    network: 'Ethereum Sepolia',
    hash: '0x3b1c9d7e5f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a11ef',
    timestamp: '2026-07-09T09:14:00Z',
    gasFee: '0.0021 ETH',
  },
  {
    id: 'tx-3',
    type: 'sent',
    status: 'pending',
    counterparty: '0x7A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
    amount: '0.032',
    symbol: 'ETH',
    usdValue: '111.86',
    network: 'Arbitrum Sepolia',
    hash: '0xa4d6e8f0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6',
    timestamp: '2026-07-08T22:47:00Z',
    gasFee: '0.0004 ETH',
  },
  {
    id: 'tx-4',
    type: 'received',
    status: 'completed',
    counterparty: '0x1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e',
    amount: '250.00',
    symbol: 'USDC',
    usdValue: '250.00',
    network: 'Base Sepolia',
    hash: '0xc9e1f3a5b7d9e1f3a5c7e9f1a3b5d7e9f1a3c5e7f9b1d3e5f7a9c1e3f5b7d9a1',
    timestamp: '2026-07-07T18:03:00Z',
    gasFee: '0.0002 ETH',
  },
  {
    id: 'tx-5',
    type: 'sent',
    status: 'failed',
    counterparty: '0x6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c',
    amount: '0.500',
    symbol: 'ETH',
    usdValue: '1,740.25',
    network: 'Ethereum Sepolia',
    hash: '0xf1e3d5c7b9a1f3e5d7c9b1a3f5e7d9c1b3a5f7e9d1c3b5a7f9e1d3c5b7a9f1e3',
    timestamp: '2026-07-06T11:20:00Z',
    gasFee: '0.0019 ETH',
  },
  {
    id: 'tx-6',
    type: 'received',
    status: 'completed',
    counterparty: '0x2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f',
    amount: '0.150',
    symbol: 'ETH',
    usdValue: '521.55',
    network: 'Ethereum Sepolia',
    hash: '0x5d7e9f1c3b5a7d9f1e3c5b7a9d1f3e5c7b9a1d3f5e7c9b1a3d5f7e9c1b3a5d7f',
    timestamp: '2026-07-05T08:55:00Z',
    gasFee: '0.0015 ETH',
  },
  {
    id: 'tx-7',
    type: 'sent',
    status: 'completed',
    counterparty: '0x8F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a',
    amount: '75.00',
    symbol: 'USDC',
    usdValue: '75.00',
    network: 'Arbitrum Sepolia',
    hash: '0x2c4e6f8a0b2d4f6a8c0e2f4a6b8d0e2f4a6c8e0f2a4b6d8e0f2a4c6e8b0d2f4a',
    timestamp: '2026-07-04T16:12:00Z',
    gasFee: '0.0003 ETH',
  },
  {
    id: 'tx-8',
    type: 'received',
    status: 'pending',
    counterparty: '0x3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e',
    amount: '0.064',
    symbol: 'ETH',
    usdValue: '222.60',
    network: 'Base Sepolia',
    hash: '0x7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d',
    timestamp: '2026-07-03T07:28:00Z',
    gasFee: '0.0002 ETH',
  },
];

export const securityStatus = {
  passkey: { label: 'Passkey Authentication', active: true },
  visualPassword: { label: 'Visual Password', active: false, note: 'Not yet configured' },
  recoveryMethod: { label: 'Recovery Method', active: true },
};

export const walletEvents = [
  { id: 'ev-1', label: 'Signed in with passkey', timestamp: '2026-07-09T14:30:00Z' },
  { id: 'ev-2', label: 'New device authorized', timestamp: '2026-07-08T10:12:00Z' },
  { id: 'ev-3', label: 'Wallet address copied', timestamp: '2026-07-07T19:41:00Z' },
];

export const passkeys = [
  { id: 'pk-1', label: 'MacBook Pro — Touch ID', createdAt: '2026-05-14T10:00:00Z', current: true },
  { id: 'pk-2', label: 'iPhone 16 Pro — Face ID', createdAt: '2026-06-02T09:30:00Z', current: false },
];

export const connectedDevices = [
  { id: 'dev-1', label: 'MacBook Pro', location: 'Mumbai, IN', lastActive: '2026-07-10T08:15:00Z', current: true },
  { id: 'dev-2', label: 'iPhone 16 Pro', location: 'Mumbai, IN', lastActive: '2026-07-09T21:40:00Z', current: false },
  { id: 'dev-3', label: 'Chrome — Windows', location: 'Pune, IN', lastActive: '2026-06-28T13:05:00Z', current: false },
];

export const sessions = [
  { id: 'ses-1', label: 'Current session', device: 'MacBook Pro · Chrome', startedAt: '2026-07-10T08:15:00Z', current: true },
  { id: 'ses-2', label: 'Mobile app', device: 'iPhone 16 Pro · Vault iOS', startedAt: '2026-07-09T21:40:00Z', current: false },
];

// 14-day portfolio value snapshots (USD), oldest first. UI-only --
// no chart library, just enough shape for a sparkline/bar visual.
export const portfolioHistory = [
  16920, 17140, 16880, 17310, 17580, 17420, 17890,
  17650, 18010, 18240, 17980, 18410, 18120, 18590,
];

export const marketOverview = [
  { symbol: 'ETH', name: 'Ethereum', price: '3,478.20', change: '+2.4%', trend: 'up' },
  { symbol: 'BTC', name: 'Bitcoin', price: '68,940.10', change: '+0.8%', trend: 'up' },
  { symbol: 'ARB', name: 'Arbitrum', price: '1.51', change: '-1.1%', trend: 'down' },
];
