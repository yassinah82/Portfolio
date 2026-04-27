const nodemailer = require("nodemailer");

const sendEmail = async ({ name, email, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `📬 New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3a6cf4; border-bottom: 2px solid #3a6cf4; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #333; width: 100px;">Name:</td>
              <td style="padding: 10px; color: #555;">${name}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 10px; color: #555;">
                <a href="mailto:${email}" style="color: #3a6cf4;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #333; vertical-align: top;">Message:</td>
              <td style="padding: 10px; color: #555; line-height: 1.6;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">
            Sent from your Portfolio contact form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email notification sent successfully");
    return true;
  } catch (error) {
    console.error("📧 Email notification failed:", error.message);
    return false;
  }
};

module.exports = sendEmail;
