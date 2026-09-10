/**
 * Single source of truth for all contact details.
 * Import this everywhere instead of hardcoding — keeps the whole site consistent.
 */
export const CONTACT = {
  // ── Phone ─────────────────────────────────────────────────────────────────
  phone:          '09082533234',
  phoneFormatted: '0908 253 3234',
  phoneTel:       'tel:09082533234',

  phone2:          '09319556850',
  phone2Formatted: '0931 955 6850',
  phone2Tel:       'tel:09319556850',

  // ── Email ─────────────────────────────────────────────────────────────────
  email:     'andtraveltours87@gmail.com',
  emailHref: 'mailto:andtraveltours87@gmail.com',

  // ── Address ───────────────────────────────────────────────────────────────
  // Street/subdivision kept only in the map embed; not shown on page per client request
  address:      'Bacoor, Cavite, Philippines',
  addressShort: 'Bacoor, Cavite',

  // ── Social ────────────────────────────────────────────────────────────────
  facebook:  'https://www.facebook.com/profile.php?id=61590018405492',
  messenger: 'https://www.facebook.com/messages/t/61590018405492',

  // ── Map ───────────────────────────────────────────────────────────────────
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.0!2d120.9758855!3d14.4029956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d3cd7b867c07%3A0x67d863fe84b55cb!2sDanarose%20Residences!5e0!3m2!1sen!2sph!4v1718000000000',
} as const
