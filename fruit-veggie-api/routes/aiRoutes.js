const express = require('express');
const router = express.Router();
const vertexAIService = require('../services/vertexAIService');
const Produce = require('../models/produceModel');
const redisClient = require('../config/redis');

// Generate health insights for a produce item
router.post('/health-insights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get produce item
    const produce = await Produce.findById(id);
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    // Check cache first
    const cacheKey = `health_insights_${id}`;
    if (redisClient.isReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ insights: JSON.parse(cached) });
      }
    }

    // Generate insights with AI
    const insights = await vertexAIService.generateHealthInsights(
      produce.name, 
      produce.nutrition
    );

    // Update produce with insights
    produce.aiInsights = insights;
    await produce.save();

    // Cache the results
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(insights), { EX: 86400 }); // 24 hours
    }

    res.json({ insights });
  } catch (error) {
    console.error('Error generating health insights:', error);
    res.status(500).json({ 
      message: 'Failed to generate health insights',
      error: error.message 
    });
  }
});

// Generate translations for a produce item
router.post('/translate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get produce item
    const produce = await Produce.findById(id);
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    // Check cache first
    const cacheKey = `translations_${id}`;
    if (redisClient.isReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ translations: JSON.parse(cached) });
      }
    }

    // Generate translations with AI
    const translations = await vertexAIService.translateProduceName(produce.name);

    // Update produce with translations
    produce.translations = new Map(Object.entries(translations));
    await produce.save();

    // Cache the results
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(translations), { EX: 604800 }); // 7 days
    }

    res.json({ translations });
  } catch (error) {
    console.error('Error generating translations:', error);
    res.status(500).json({ 
      message: 'Failed to generate translations',
      error: error.message 
    });
  }
});

// Batch generate for multiple items
router.post('/batch-process', async (req, res) => {
  try {
    const { produceIds, features = ['insights', 'translations'] } = req.body;
    
    if (!Array.isArray(produceIds) || produceIds.length === 0) {
      return res.status(400).json({ message: 'Invalid produce IDs provided' });
    }

    const results = [];
    
    for (const id of produceIds.slice(0, 10)) { // Limit to 10 items per batch
      try {
        const produce = await Produce.findById(id);
        if (!produce) continue;

        let insights = [];
        let translations = {};

        if (features.includes('insights')) {
          insights = await vertexAIService.generateHealthInsights(produce.name, produce.nutrition);
          produce.aiInsights = insights;
        }

        if (features.includes('translations')) {
          translations = await vertexAIService.translateProduceName(produce.name);
          produce.translations = new Map(Object.entries(translations));
        }

        await produce.save();
        
        results.push({
          id,
          name: produce.name,
          insights,
          translations
        });

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing ${id}:`, error);
      }
    }

    res.json({ 
      message: `Processed ${results.length} items`,
      results 
    });
  } catch (error) {
    console.error('Error in batch processing:', error);
    res.status(500).json({ 
      message: 'Batch processing failed',
      error: error.message 
    });
  }
});

// Test endpoint
// router.get('/test', async (req, res) => {
//   try {
//     const available = vertexAIService.isAvailable();
//     if (!available) {
//       return res.json({ status: 'Vertex AI not configured' });
//     }

//     const testInsights = await vertexAIService.generateHealthInsights('Apple', {
//       calories: 52,
//       protein: 0.3,
//       carbs: 14,
//       fat: 0.2,
//       fiber: 2.4
//     });

//     res.json({ 
//       status: 'Vertex AI working!',
//       testInsights 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       status: 'Error', 
//       error: error.message 
//     });
//   }
// });

module.exports = router;