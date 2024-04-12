import nodemailer from 'nodemailer';

/**
 * GMail SMTP Configuration
 *
 * SMTP server address: smtp.gmail.com
 * SMTP name: Your full name
 * SMTP username: Your full email address
 * SMTP password: Your email password
 * SMTP port (TLS): 587
 * SMTP port (SSL): 465
 */

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'adc20975316293',
    pass: '3c8ca5b61944e7'
  }
});

export async function sendEmail (
  { to, subject, html }: { to: string, subject: string, html: string }
) {
  await transport.sendMail({
    from: `"Auth demo" <haideritx@gmail.com>`,
    to,
    subject,
    html
  })
}
