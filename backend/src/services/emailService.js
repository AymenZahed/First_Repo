const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const html = template(data);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  await sendEmail(email, 'Verify Your Email', 'verification', { verificationUrl });
};

exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(email, 'Reset Your Password', 'passwordReset', { resetUrl });
};

exports.sendApplicationAcceptedEmail = async (email, missionTitle) => {
  await sendEmail(email, 'Application Accepted', 'applicationAccepted', { missionTitle });
};

exports.sendApplicationRejectedEmail = async (email, missionTitle, reason) => {
  await sendEmail(email, 'Application Update', 'applicationRejected', { missionTitle, reason });
};

exports.sendNewApplicationEmail = async (email, missionTitle) => {
  await sendEmail(email, 'New Application Received', 'welcome', { missionTitle });
};

exports.sendMissionReminderEmail = async (email, missionTitle, date) => {
  await sendEmail(email, 'Mission Reminder', 'missionReminder', { missionTitle, date });
};

module.exports = exports;
