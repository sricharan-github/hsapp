require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User'); // User model
const loginRoutes = require('./routes/login'); // Login routes
const registrationRoutes = require('./routes/registration'); // Registration routes
const userRoutes = require('./routes/user'); // User routes
const bcrypt = require('bcrypt'); // Password hashing
const path = require('path');

// Routes
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.REACT_APP_SERVER_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB Connection
console.log("MongoDB URI:", process.env.MONGODB_URI); 
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    createDefaultUser();
  })
  .catch(err => console.error(err));

  app.use('/api/users', userRoutes);
  
// Create default user if it doesn't exist
const createDefaultUser = async () => {
  const username = 'admin';
  const password = 'Pass@123';

  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log('Default user created');
  }
};

app.use('/api/login', loginRoutes);
app.use('/api/registrations', registrationRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
