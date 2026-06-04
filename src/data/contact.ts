/**
 * Single source of truth for all contact details.
 * Import this everywhere instead of hardcoding — keeps the whole site consistent.
 */
export const CONTACT = {
  // ── Phone ─────────────────────────────────────────────────────────────────
  phone:          '09159234547',
  phoneFormatted: '0915 923 4547',
  phoneTel:       'tel:09159234547',

  phone2:          '09319556850',
  phone2Formatted: '0931 955 6850',
  phone2Tel:       'tel:09319556850',

  // ── Email ─────────────────────────────────────────────────────────────────
  email:     'andtraveltours87@gmail.com',
  emailHref: 'mailto:andtraveltours87@gmail.com',

  // ── Address ───────────────────────────────────────────────────────────────
  // Blk 10 Lot 6 kept only for map embed; not shown on page per client request
  address:      'Danarose Residences,\nBacoor, Cavite, Philippines',
  addressShort: 'Danarose Residences, Bacoor, Cavite',

  // ── Social ────────────────────────────────────────────────────────────────
  facebook:  'https://www.facebook.com/profile.php?id=61590018405492',
  messenger: 'https://www.facebook.com/messages/t/61590018405492',

  // ── Map ───────────────────────────────────────────────────────────────────
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963.5!2d120.9912!3d14.4097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d100207fad3b%3A0x5fba74cbe6b7fcc!2sBlk%2010%20Lot%206!5e0!3m2!1sen!2sph!4v1718000000',
} as const
