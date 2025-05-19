const mongoose = require('mongoose');

// Blog schema definition
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },           // Blog title
  description: { type: String, required: true },     // Blog content/description
  imageUrl: { type: String },                        // Optional image URL
  author: { type: String, required: true },          // Author username
  draft: { type: Boolean, default: false },          // Draft status
  createdAt: { type: Date, default: Date.now },      // Creation timestamp
  updatedAt: { type: Date, default: Date.now }       // Last update timestamp
});

// Export Blog model
module.exports = mongoose.model('Blog', blogSchema);