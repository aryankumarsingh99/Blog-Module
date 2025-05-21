const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const path = require('path');

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'https://blog-module-82kx.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // if you're using cookies or authorization headers
}));


// Parse incoming JSON requests
app.use(express.json());


const MONGO_URI =  process.env.MONGO_URI  
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Optional: exit if cannot connect
  });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));