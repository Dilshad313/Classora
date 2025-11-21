const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const adminRoutes = require('./routes/admin/adminRoutes');
const adminSettingsRoutes = require('./routes/admin/adminSettingsRoutes');
const classesRoutes = require('./routes/classesRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const employeesRoutes = require('./routes/employeesRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feesRoutes = require('./routes/feesRoutes');
const accountsRoutes = require('./routes/accountsRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/classora';

app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/accounts', accountsRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    console.log(`Server running on http://localhost:${PORT}`);
    
    app.listen(PORT);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });