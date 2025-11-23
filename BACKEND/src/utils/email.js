// backend/utils/email.js 
const nodemailer = require("nodemailer"); 
 
const { 
  EMAIL_HOST, 
  EMAIL_PORT, 
  EMAIL_USER, 
  EMAIL_PASS, 
  EMAIL_TO, 
} = process.env; 
 
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) { 
  console.warn( 
    "[email] Missing one or more EMAIL_* env vars. Email sending will fail." 
  ); 
} 
 
// IMPORTANT: port/secure pairing: 
// - 587  => secure: false 
// - 465  => secure: true 
const port = Number(EMAIL_PORT) || 587; 
const secure = port === 465; 
 
const transporter = nodemailer.createTransport({ 
  host: EMAIL_HOST, 
  port, 
  secure, 
  auth: { 
    user: EMAIL_USER, 
    pass: EMAIL_PASS, 
  }, 
  // Useful while debugging your "Unexpected socket close" 
  logger: true, 
  debug: true, 
  connectionTimeout: 10000, // 10s 
}); 
 
/** 
 * Call once on server startup to see if SMTP works. 
 */ 
async function verifyTransporter() { 
  try { 
    console.log("[email] Verifying SMTP transporter..."); 
    const res = await transporter.verify(); 
    console.log("[email] Transporter verified:", res); 
  } catch (err) { 
    console.error("[email] Transporter verification FAILED:", err); 
  } 
} 
 
/** 
 * Send contact email to your inbox. 
 */ 
async function sendContactEmail({ name, email, message }) { 
  const submittedAt = new Date().toLocaleString(); 
 
  const html = ` 
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
      <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f6f8fa;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <!-- Main Container -->
            <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.07),0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 40px 36px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:-0.5px;">New Contact Request</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;font-weight:400;">You've received a new message from your website</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding:40px;">
                  
                  <!-- Sender Info Card -->
                  <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:28px;background-color:#f8f9fb;border-radius:8px;overflow:hidden;">
                    <tr>
                      <td style="padding:24px;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;">
                          <tr>
                            <td style="padding-bottom:16px;">
                              <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:50%;text-align:center;line-height:48px;color:#ffffff;font-size:20px;font-weight:600;margin-bottom:12px;">
                                ${name.charAt(0).toUpperCase()}
                              </div>
                              <h2 style="margin:12px 0 4px;color:#1a202c;font-size:20px;font-weight:600;">${name}</h2>
                              <a href="mailto:${email}" style="color:#667eea;text-decoration:none;font-size:14px;font-weight:500;">${email}</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Message Section -->
                  <div style="margin-bottom:28px;">
                    <div style="display:flex;align-items:center;margin-bottom:12px;">
                      <h3 style="margin:0;color:#4a5568;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message</h3>
                    </div>
                    <div style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:20px;color:#2d3748;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</div>
                  </div>
                  
                  <!-- Metadata -->
                  <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid #e2e8f0;padding-top:20px;">
                    <tr>
                      <td style="padding-top:20px;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;">
                          <tr>
                            <td style="color:#718096;font-size:13px;padding:8px 0;">
                              <span style="display:inline-block;width:110px;font-weight:600;">Submitted at:</span>
                              <span style="color:#2d3748;">${submittedAt}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Action Button -->
                  <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:32px;">
                    <tr>
                      <td align="center">
                        <a href="mailto:${email}?subject=Re:%20Contact%20Form%20Submission" style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 4px 6px rgba(102,126,234,0.25);">Reply to ${name}</a>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color:#f8f9fb;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="margin:0;color:#718096;font-size:13px;line-height:1.5;">
                    This email was automatically generated from your website's contact form.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `; 
 
  const text = ` 
New contact form submission: 
 
Name: ${name} 
Email: ${email} 
Message: 
${message} 
 
Submitted At: ${submittedAt} 
`; 
 
  return transporter.sendMail({ 
    from: `"Website Contact" <${EMAIL_USER}>`, 
    to: EMAIL_TO, 
    subject: `New Contact from ${name}`, 
    text, 
    html, 
  }); 
} 
 
module.exports = { 
  transporter, 
  verifyTransporter, 
  sendContactEmail, 
};