const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { sendAppointmentEmail } = require('../services/emailService');
const { createCalendarEvent } = require('../services/calendarService');
const moment = require('moment-timezone');

function getISO(date, time) {
  return moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata').toISOString();
}

router.post('/', async (req, res) => {
  try {
    const { patientName, patientEmail, doctorName, appointmentDate, appointmentTime, notes } = req.body;

    if (!patientName || !patientEmail || !doctorName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "All fields required" });
    }

    const start = getISO(appointmentDate, appointmentTime);
    const end = moment(start).add(30, 'minutes').toISOString();

    const event = await createCalendarEvent(
      patientName, patientEmail, doctorName, start, end, notes
    );

    const emailSent = await sendAppointmentEmail(
      patientName, patientEmail, doctorName, start, notes
    );

    const appointment = new Appointment({
      patientName,
      patientEmail,
      doctorName,
      appointmentDate,
      appointmentTime,
      notes,
      calendarEventId: event.id,
      emailSent
    });

    await appointment.save();

    res.json({
      success: true,
      calendarLink: event.htmlLink
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const data = await Appointment.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;
