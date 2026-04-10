const { google } = require('googleapis');

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

async function createCalendarEvent(name, email, doctor, start, end, notes) {
  const event = {
    summary: `Appointment: ${name} with ${doctor}`,
    description: `Patient: ${name}\nNotes: ${notes}`,
    start: { dateTime: start, timeZone: 'Asia/Kolkata' },
    end: { dateTime: end, timeZone: 'Asia/Kolkata' },
    attendees: [{ email }]
  };

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    resource: event
  });

  return res.data;
}

module.exports = { createCalendarEvent };
