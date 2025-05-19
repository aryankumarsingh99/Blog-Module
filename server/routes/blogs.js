const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer storage configuration for blog image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

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
        { title, description, imageUrl, draft, updatedAt: Date.now() },
        { new: true }
      );
    } else {
      // Create new blog
      blog = new Blog({ title, description, imageUrl, author, draft });
      await blog.save();
    }
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ message: 'Error saving blog', error: err.message });
  }
});

// Get all blogs by a specific user
router.get('/user/:author', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.author });
    res.json({ blogs });
  } catch {
    res.status(500).json({ blogs: [] });
  }
});

// Get all blogs (sorted by creation date descending)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch {
    res.status(500).json({ blogs: [] });
  }
});

// Delete a blog by ID
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting blog' });
  }
});

module.exports = router;