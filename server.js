require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const appointmentRoutes = require('./routes/appointment');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static frontend serve
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// Routes
app.use('/api/appointments', appointmentRoutes);

// Test route
app.get('/api', (req, res) => {
  res.send('API Running 🚀');
});

// Root route (frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
