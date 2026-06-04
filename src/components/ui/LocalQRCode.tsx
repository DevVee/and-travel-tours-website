/**
 * Self-contained QR code rendered entirely client-side via qrcode.react.
 * Replaces the previous api.qrserver.com third-party dependency:
 *   – No external API calls on every page load
 *   – No privacy leakage of visitor IPs to a third-party server
 *   – Works offline / when qrserver is down
 *   – No SRI concern (no external resource)
 */
import { QRCodeSVG } from 'qrcode.react'
import { CONTACT } from '@data/contact'

interface LocalQRCodeProps {
  size?: number
  className?: string
}

export function LocalQRCode({ size = 220, className = '' }: LocalQRCodeProps) {
  return (
    <QRCodeSVG
      value={CONTACT.facebook}
      size={size}
      bgColor="#ffffff"
      fgColor="#111111"
      level="M"
      className={`block rounded-lg ${className}`}
    />
  )
}
