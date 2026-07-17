import { QrCode } from 'lucide-react';

/**
 * Placeholder QR display. Renders a stylized stand-in rather than a
 * real scannable code -- QR generation is out of scope until the
 * wallet/address logic is wired to Turnkey.
 *
 * @param {number} size - pixel size of the square placeholder
 */
export default function ReceiveQR({ size = 220 }) {
  return (
    <div
      className="grid-motif flex items-center justify-center rounded-lg border border-border bg-bg"
      style={{ width: size, height: size }}
      role="img"
      aria-label="QR code placeholder for wallet address"
    >
      <div className="flex flex-col items-center gap-2 rounded-md bg-card/80 px-4 py-3 border border-border">
        <QrCode className="h-8 w-8 text-text-secondary" aria-hidden="true" />
        <span className="text-xs text-text-muted">QR preview unavailable</span>
      </div>
    </div>
  );
}
