const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAppointmentEmail(name, email, doctor, dateTime, notes) {
  const info = await transporter.sendMail({
    from: `"Appointment System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Appointment Confirmed with ${doctor}`,
    html: `
      <h2>Hello ${name}</h2>
      <p>Your appointment is confirmed.</p>
      <ul>
        <li><b>Doctor:</b> ${doctor}</li>
        <li><b>Date & Time:</b> ${dateTime}</li>
        <li><b>Notes:</b> ${notes || '—'}</li>
      </ul>
    `
  });

  return info.accepted.length > 0;
}

module.exports = { sendAppointmentEmail };
