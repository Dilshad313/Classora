const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');

const router = express.Router();

const ADMIN_REG_KEY = process.env.ADMIN_REG_KEY || 'CLASSORA2025';
const JWT_SECRET = process.env.JWT_SECRET || 'classora_dev_secret';

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, adminKey } = req.body;

    if (!fullName || !email || !password || !adminKey) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (adminKey !== ADMIN_REG_KEY) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin'
    });

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      user: {
        id: admin._id,
        name: admin.fullName,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (err) {
    console.error('Admin register error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({
      user: {
        id: admin._id,
        name: admin.fullName,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (err) {
    console.error('Admin login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
