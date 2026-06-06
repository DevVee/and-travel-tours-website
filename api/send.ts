import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend    = new Resend(process.env.RESEND_API_KEY)
const TO_EMAIL  = process.env.TO_EMAIL  ?? 'andtraveltours87@gmail.com'
const FROM_ADDR = `A N D Travel <${process.env.FROM_EMAIL ?? 'inquiries@andtraveltours.com'}>`
const LOGO_URL  = 'https://www.andtraveltours.com/logo.png'
const SITE_URL  = 'https://www.andtraveltours.com'

// ─── HTML builders ────────────────────────────────────────────────────────────
type Payload = { name: string; phone: string; email: string; service: string; message: string; time: string }

function inboxHtml({ name, phone, email, service, message, time }: Payload) {
  // Convert newline-separated message into HTML rows
  const rows = message.split('\n').filter(Boolean).map(line => {
    const [label, ...rest] = line.split(': ')
    const value = rest.join(': ')
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:13px;width:140px;vertical-align:top;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;font-size:14px;color:#111;">${value}</td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Inquiry</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#111111;padding:24px 32px;text-align:center;">
      <a href="${SITE_URL}" style="display:inline-block;">
        <img src="${LOGO_URL}" alt="A N D Travel and Tours" width="160" style="display:block;height:auto;max-width:160px;" />
      </a>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:2px;">New Inquiry Notification</p>
    </div>

    <!-- Service banner -->
    <div style="background:#FFF7ED;border-bottom:2px solid #FED7AA;padding:14px 32px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#F97316;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">📋 ${service}</span>
      <span style="color:#9CA3AF;font-size:12px;">${time}</span>
    </div>

    <!-- Contact details -->
    <div style="padding:28px 32px 0;">
      <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Contact Information</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:13px;width:140px;">Full Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:700;font-size:14px;color:#111;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:13px;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-weight:600;font-size:14px;color:#111;">${phone}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#6B7280;font-size:13px;">Email</td>
          <td style="padding:10px 0;font-weight:600;font-size:14px;">
            <a href="mailto:${email}" style="color:#F97316;text-decoration:none;">${email}</a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Inquiry details -->
    <div style="padding:24px 32px 0;">
      <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Inquiry Details</p>
      <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px 24px;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>
    </div>

    <!-- Reply CTA -->
    <div style="padding:28px 32px;text-align:center;">
      <a href="mailto:${email}?subject=Re: Your ${service} Inquiry — A N D Travel"
         style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;padding:13px 32px;border-radius:8px;font-weight:700;font-size:14px;">
        Reply to ${name} →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:16px 32px;text-align:center;">
      <p style="margin:0;color:#9CA3AF;font-size:12px;">A N D Travel and Tours · Danarose Residences, Bacoor, Cavite, Philippines</p>
    </div>

  </div>
</body>
</html>`
}

function autoReplyHtml({ name, service }: Payload) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Inquiry Received</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#111111;padding:28px 32px;text-align:center;">
      <a href="${SITE_URL}" style="display:inline-block;">
        <img src="${LOGO_URL}" alt="A N D Travel and Tours" width="160" style="display:block;height:auto;max-width:160px;margin:0 auto;" />
      </a>
      <p style="margin:10px 0 0;color:#D4A017;font-size:12px;font-style:italic;letter-spacing:1px;">Your Journey, Our Priority</p>
    </div>

    <!-- Hero message -->
    <div style="padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">✈️</div>
      <h1 style="margin:0 0 8px;color:#111;font-size:22px;font-weight:700;">Your inquiry is on its way!</h1>
      <p style="margin:0 0 4px;color:#6B7280;font-size:15px;">Hi <strong style="color:#111;">${name}</strong>, we got your message.</p>
      <p style="margin:0;color:#6B7280;font-size:14px;">We'll get back to you within <strong style="color:#111;">24 hours</strong>.</p>
    </div>

    <!-- What you inquired about -->
    <div style="margin:0 32px 28px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px 20px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#D97706;text-transform:uppercase;letter-spacing:1px;">Your Inquiry</p>
      <p style="margin:0;font-weight:700;color:#111;font-size:15px;">${service}</p>
    </div>

    <!-- What happens next -->
    <div style="margin:0 32px 28px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:24px;">
      <p style="margin:0 0 20px;font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">What happens next?</p>

      <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
        <div style="background:#F97316;color:#fff;min-width:28px;height:28px;border-radius:50%;font-size:12px;font-weight:700;text-align:center;line-height:28px;margin-right:14px;">1</div>
        <div>
          <p style="margin:0 0 2px;font-weight:600;font-size:14px;color:#111;">We review your inquiry</p>
          <p style="margin:0;font-size:13px;color:#6B7280;">Our team looks at your request and prepares the best options for you.</p>
        </div>
      </div>

      <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
        <div style="background:#F97316;color:#fff;min-width:28px;height:28px;border-radius:50%;font-size:12px;font-weight:700;text-align:center;line-height:28px;margin-right:14px;">2</div>
        <div>
          <p style="margin:0 0 2px;font-weight:600;font-size:14px;color:#111;">Our travel expert contacts you</p>
          <p style="margin:0;font-size:13px;color:#6B7280;">We'll call or email you within <strong>24 hours</strong> to discuss your options.</p>
        </div>
      </div>

      <div style="display:flex;align-items:flex-start;">
        <div style="background:#F97316;color:#fff;min-width:28px;height:28px;border-radius:50%;font-size:12px;font-weight:700;text-align:center;line-height:28px;margin-right:14px;">3</div>
        <div>
          <p style="margin:0 0 2px;font-weight:600;font-size:14px;color:#111;">Plan your dream trip!</p>
          <p style="margin:0;font-size:13px;color:#6B7280;">You receive a personalized itinerary crafted just for you.</p>
        </div>
      </div>
    </div>

    <!-- Messenger CTA -->
    <div style="padding:0 32px 36px;text-align:center;">
      <p style="margin:0 0 14px;color:#6B7280;font-size:13px;">Need a faster response?</p>
      <a href="https://www.facebook.com/messages/t/61590018405492"
         style="display:inline-block;background:#111111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
        💬 Chat with us on Messenger
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#111111;padding:24px 32px;text-align:center;">
      <p style="margin:0 0 6px;color:#D4A017;font-style:italic;font-size:13px;font-weight:600;">Your Journey, Our Priority</p>
      <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;">A N D Travel and Tours · Danarose Residences, Bacoor, Cavite, Philippines</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.35);font-size:11px;">andtraveltours87@gmail.com · andtraveltours.xyz</p>
    </div>

  </div>
</body>
</html>`
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, email, service, message, time } = req.body as Partial<Payload>

  if (!name || !email || !service) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const p: Payload = {
    name:    name    ?? '',
    phone:   phone   ?? '',
    email:   email   ?? '',
    service: service ?? '',
    message: message ?? '',
    time:    time    ?? new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
  }

  try {
    // 1 — Notify AND Travel inbox
    await resend.emails.send({
      from:    FROM_ADDR,
      to:      TO_EMAIL,
      replyTo: email,
      subject: `📋 New ${service} Inquiry from ${name}`,
      html:    inboxHtml(p),
    })

    // 2 — Auto-reply to the visitor
    await resend.emails.send({
      from:    FROM_ADDR,
      to:      email,
      subject: `We received your inquiry! — A N D Travel and Tours`,
      html:    autoReplyHtml(p),
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[api/send]', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
