const express = require('express');
const Registration = require('../models/Registration');
const connectDB = require('../utils/connectDB');

const router = express.Router();
connectDB();

router.post('/', async (req, res) => {
  try {
    const registrationData = req.body;
    const newRegistration = new Registration(registrationData);
    await newRegistration.save();
    res.status(201).json({ message: 'Registration successful', registrationId: newRegistration._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/check-phone', async (req, res) => {
  const { phoneNumber } = req.query;

  try {
    const existingEntry = await Registration.findOne({ phoneNumber });
    if (existingEntry) {
      return res.status(400).json({ error: 'This phone number is already registered.' });
    }
    res.status(200).json({ message: 'Phone number is available.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
