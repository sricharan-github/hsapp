// models/Registration.js
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  registrationType: { type: String, required: true },
  otherType: { type: String },
  fullName: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  educationalQualification: { type: String },
  occupation: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String },
  address: {
    doorNo: { type: String },
    street: { type: String },
    landmark: { type: String },
    village: { type: String },
    pincode: { type: String },
  },
  otherDetails: { type: String },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

module.exports = mongoose.model('Registration', RegistrationSchema);
