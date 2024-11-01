// api/login.js
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path based on your structure
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  console.log("Request Method:", req.method);
  console.log("Request Body:", req.body);
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      res.json({ message: 'Login successful' });
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
