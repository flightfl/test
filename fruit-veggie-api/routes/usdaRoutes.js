const express = require('express');
const router = express.Router();
const usdaService = require('../services/usdaService');
const Produce = require('../models/produceModel');

// Search USDA database
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchResults = await usdaService.searchFoods(query, parseInt(limit));
    
    // Convert to our format
    const convertedResults = searchResults.foods?.map(food => 
      usdaService.convertToProduceFormat(food)
    ) || [];

    res.json({
      totalResults: searchResults.totalHits || 0,
      results: convertedResults
    });
  } catch (error) {
    console.error('USDA search error:', error);
    res.status(500).json({ 
      message: 'Failed to search USDA database',
      error: error.message 
    });
  }
});

// Import food from USDA to our database
router.post('/import/:fdcId', async (req, res) => {
  try {
    const { fdcId } = req.params;
    
    // Get detailed food data from USDA
    const usdaFood = await usdaService.getFoodDetails(fdcId);
    
    // Convert to our format
    const produceData = usdaService.convertToProduceFormat(usdaFood);
    
    // Check if already exists in our database
    const existingProduce = await Produce.findOne({ 
      $or: [
        { usdaId: fdcId },
        { name: produceData.name }
      ]
    });
    
    if (existingProduce) {
      return res.status(400).json({ 
        message: 'This produce item already exists in the database' 
      });
    }
    
    // Save to our database
    const newProduce = await Produce.create({
      ...produceData,
      usdaId: fdcId
    });
    
    res.status(201).json({
      message: 'Successfully imported from USDA database',
      produce: newProduce
    });
  } catch (error) {
    console.error('USDA import error:', error);
    res.status(500).json({ 
      message: 'Failed to import from USDA database',
      error: error.message 
    });
  }
});

module.exports = router;