const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const Blog = require('../models/Blog');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Multer storage config for profile photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload or update user profile photo
router.post('/profile-photo/:username', upload.single('profilePhoto'), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { profilePhoto: `/uploads/profiles/${req.file.filename}` },
      { new: true }
    );
    res.json({ profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile photo' });
  }
});

// User signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update a blog post (with optional image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, author, draft, blogId } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    let blog;
    if (blogId) {
      // Update existing blog
      blog = await Blog.findByIdAndUpdate(
        blogId,
        { title, description, imageUrl, draft: draft === "true", updatedAt: Date.now() },
        { new: true }
      );
    } else {
      // Create new blog
      blog = new Blog({ title, description, imageUrl, author, draft: draft === "true" });
      await blog.save();
    }
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ message: 'Error saving blog', error: err.message });
  }
});

module.exports = router;