// Require necessary packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.REACT_APP_SERVER_URL, // Update this if necessary
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(bodyParser.json());

// MongoDB Connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));

// API Routes
const loginRoutes = require('./routes/login');
const registrationRoutes = require('./routes/registration');
const userRoutes = require('./routes/user');

// Handle OPTIONS method for specific routes
app.options('/api/login', cors(corsOptions)); // Allow OPTIONS for /api/login
app.use('/api/login', loginRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catchall handler for any request that doesn't match above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
