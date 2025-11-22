// src/utils/mailer.js
// Lazy, test-friendly mailer that supports SendGrid or SMTP.
// - Does NOT import @sendgrid/mail or nodemailer at module load time.
// - No-ops in test mode (NODE_ENV === 'test').
// - Throws only when actually sending in non-test mode and missing config.

const IS_TEST = process.env.NODE_ENV === 'test';
const USING_SENDGRID = !!process.env.SENDGRID_API_KEY;

async function _sendWithSendgrid({ to, subject, html }) {
  // lazy require so Jest discovery doesn't import ESM deps
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    html,
  };
  return sgMail.send(msg);
}

async function _sendWithSmtp({ to, subject, html }) {
  // lazy require nodemailer only when used
  const nodemailer = require('nodemailer');
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT || 587;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

async function sendEmail({ to, subject, html }) {
  if (!to || !subject) throw new Error('Missing to or subject');

  if (IS_TEST) {
    // Do nothing in tests
    return Promise.resolve();
  }

  if (USING_SENDGRID) {
    return _sendWithSendgrid({ to, subject, html });
  }

  // Otherwise try SMTP
  return _sendWithSmtp({ to, subject, html });
}

module.exports = sendEmail;
