// services/email.service.js
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a verification email with a sign-in link
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationLink - The verification link
 * @returns {Promise<Object>} - Email sending result
 */
const sendVerificationEmail = async (email, name, verificationLink) => {
  const mailOptions = {
    from: `"Lab Dashboard" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Sign in to Your Lab Dashboard Account',
    html: `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-spacing: 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <tr>
        <td style="padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="background-color: #0DB79F; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Lab Dashboard</h1>
            </td>
          </tr>
          </table>
        </td>
      </tr>
      
      <!-- Body -->
      <tr>
        <td style="padding: 40px 40px 20px 40px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <h2 style="margin: 0 0 25px 0; color: #333333; font-size: 24px; font-weight: 600;">Hello <span style="color: #0DB79F;">${name}</span>,</h2>
                <p style="margin: 0 0 25px 0; color: #555555; line-height: 1.6; font-size: 16px;">We received a request to sign in to your Lab Dashboard account. Please use the secure button below to complete the process. This link will expire in 24 hours for security purposes.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Button -->
      <tr>
        <td style="padding: 0 40px 30px 40px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align: center; padding: 20px 0;">
                <a href="${verificationLink}" style="display: inline-block; background-color: #0DB79F; color: white; padding: 14px 36px; font-size: 16px; text-decoration: none; border-radius: 4px; font-weight: 600; letter-spacing: 0.5px; transition: all 0.3s; border: 2px solid #0DB79F;">
                  Sign In Securely
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Notice -->
      <tr>
        <td style="padding: 0 40px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                  <strong>Security Notice:</strong> If you didn't request this email, you can safely ignore it. Your account security is important to us.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="padding: 30px 40px 40px 40px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="border-top: 1px solid #eeeeee; padding-top: 30px; color: #777777; font-size: 14px; line-height: 1.6;">
                <p style="margin: 0 0 10px 0;">Best regards,</p>
                <p style="margin: 0 0 20px 0;"><strong>Lab Dashboard Team</strong></p>
                <p style="margin: 0; font-size: 12px; color: #999999;">© 2025 Lab Dashboard. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`,
    // Plain text alternative
    text: `Hello ${name},\n\nClick on the following link to sign in to your account: ${verificationLink}\n\nThis link will expire in 24 hours.\n\nIf you didn't request this email, you can safely ignore it.\n\nBest regards,\nLab Dashboard Team`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test the email connection
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    throw error;
  }
};

export {
  sendVerificationEmail,
  testEmailConnection,
};