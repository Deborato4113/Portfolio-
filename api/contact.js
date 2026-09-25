// Vercel serverless function: /api/contact
// Sends the portfolio contact form to your inbox via the Resend API.
//
// SETUP (one-time, no domain required):
// 1. Create a free account at https://resend.com using
//    deboratochaudhury2023@gmail.com as the sign-up email. This matters:
//    without a verified domain, Resend only allows sending FROM the shared
//    "onboarding@resend.dev" address, and only TO the email address you
//    signed up with. Since that's this exact inbox, no domain is needed.
// 2. Create an API key (Resend dashboard → API Keys).
// 3. Deploy this project on Vercel (GitHub Pages cannot run this file — it
//    only serves static files, it has no server to execute this code).
// 4. In the Vercel project settings → Environment Variables, add:
//      RESEND_API_KEY = re_xxxxxxxxxxxx        (from step 2)
//      CONTACT_TO      = deboratochaudhury2023@gmail.com  (must match the Resend account's email)
//    (CONTACT_FROM can be left unset — it defaults to onboarding@resend.dev)
// 5. Redeploy. The form on the site will now POST to /api/contact automatically.
//
// If you later want messages deliverable to ANY inbox (not just your own),
// or want the "From" address to look like your own domain, that requires
// verifying a domain in Resend — optional, not needed for this setup.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO   = process.env.CONTACT_TO   || 'deboratochaudhury2023@gmail.com';
    const FROM = process.env.CONTACT_FROM || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'Server is missing RESEND_API_KEY' });
    }

    const emailPayload = {
      from: `Portfolio Contact Form <${FROM}>`,
      to: [TO],
      reply_to: email,
      subject: `New portfolio message from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New message from your portfolio site</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `
    };

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
