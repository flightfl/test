const express = require('express');
const router = express.Router();
const Produce = require('../models/produceModel');
const redisClient = require('../config/redis');

// Get all produce
router.get('/', async (req, res) => {
  try {
    // Only try cache if Redis is ready
    if (redisClient.isReady) {
      const cacheKey = 'all_produce';
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        console.log('Serving from cache');
        return res.json(JSON.parse(cachedData));
      }
    }
    
    // Get from database
    const produce = await Produce.find();
    
    // Store in cache if Redis is ready
    if (redisClient.isReady) {
      await redisClient.set('all_produce', JSON.stringify(produce), {
        EX: 3600 // 1 hour
      });
    }
    
    res.json(produce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single produce
router.get('/:id', async (req, res) => {
  try {
    // Only try cache if Redis is ready
    if (redisClient.isReady) {
      const cacheKey = `produce_${req.params.id}`;
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        console.log('Serving from cache');
        return res.json(JSON.parse(cachedData));
      }
    }
    
    const produce = await Produce.findById(req.params.id);
    
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }
    
    // Store in cache if Redis is ready
    if (redisClient.isReady) {
      await redisClient.set(`produce_${req.params.id}`, JSON.stringify(produce), {
        EX: 3600 // 1 hour
      });
    }
    
    res.json(produce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new produce (no caching needed for creation)
router.post('/', async (req, res) => {
  try {
    const produce = await Produce.create(req.body);
    
    // Invalidate cache if Redis is ready
    if (redisClient.isReady) {
      await redisClient.del('all_produce');
    }
    
    res.status(201).json(produce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;