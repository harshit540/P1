const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  notes: { type: String, default: '' },
  calendarEventId: String,
  emailSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
