const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username
  email: { type: String, required: true, unique: true },    // Unique email
  password: { type: String, required: true },               // Hashed password
  profilePhoto: { type: String }                            // Optional profile photo URL
});

// Export User model
module.exports = mongoose.model('User', userSchema);