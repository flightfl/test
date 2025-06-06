const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Login with just a name
router.post('/login', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Please provide a name' });
    }
    
    // Check if user exists
    let user = await User.findOne({ name });
    
    // If not, create a new user
    if (!user) {
      user = await User.create({ name });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Set JWT as an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.json({
      _id: user._id,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  
  res.json({ message: 'Logged out successfully' });
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to favorites
router.post('/favorites', protect, async (req, res) => {
  try {
    const { produceId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check if already in favorites
    if (user.favorites.includes(produceId)) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    
    // Add to favorites
    user.favorites.push(produceId);
    await user.save();
    
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/favorites/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Remove from favorites
    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== req.params.id
    );
    
    await user.save();
    
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;