// usdaService.js is used in usdaRoutes.js

const axios = require('axios');

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

class USDAService {
    constructor() {
        this.apiKey = process.env.USDA_API_KEY;
    }

    // Search for foods by name
    async searchFoods(query, pageSize = 10) {
        if (!this.apiKey) {
            throw new Error('USDA API key not configured');
        }

        try {
        const response = await axios.post(`${USDA_BASE_URL}/foods/search`, {
            query: query,
            dataType: ['Foundation', 'SR Legacy'], // Use reliable data sources
            pageSize: pageSize,
            requireAllWords: false
        }, {
            params: {
            api_key: this.apiKey
            },
            headers: {
            'Content-Type': 'application/json'
            }
        });

        return response.data;
        } catch (error) {
        console.error('USDA API search error:', error.response?.data || error.message);
        throw new Error('Failed to search USDA food database');
        }
    }

    // Get detailed food information by FDC ID
    async getFoodDetails(fdcId) {
        if (!this.apiKey) {
        throw new Error('USDA API key not configured');
        }

        try {
        const response = await axios.get(`${USDA_BASE_URL}/food/${fdcId}`, {
            params: {
            api_key: this.apiKey
            }
        });

        return response.data;
        } catch (error) {
        console.error('USDA API details error:', error.response?.data || error.message);
        throw new Error('Failed to get food details from USDA');
        }
    }

    // Convert USDA food data to our produce model format
    convertToProduceFormat(usdaFood) {
        const nutrients = {};
        
        // Map USDA nutrients to our format
        if (usdaFood.foodNutrients) {
        usdaFood.foodNutrients.forEach(nutrient => {
            switch (nutrient.nutrient?.id) {
            case 1008: // Energy (calories)
                nutrients.calories = Math.round(nutrient.amount || 0);
                break;
            case 1003: // Protein
                nutrients.protein = Math.round((nutrient.amount || 0) * 100) / 100;
                break;
            case 1005: // Carbohydrates
                nutrients.carbs = Math.round((nutrient.amount || 0) * 100) / 100;
                break;
            case 1004: // Total lipid (fat)
                nutrients.fat = Math.round((nutrient.amount || 0) * 100) / 100;
                break;
            case 1079: // Fiber
                nutrients.fiber = Math.round((nutrient.amount || 0) * 100) / 100;
                break;
            }
        });
    }

    // Determine category (simple logic)
    const description = usdaFood.description?.toLowerCase() || '';
    let category = 'other';
    
    const fruits = ['apple', 'banana', 'orange', 'grape', 'berry', 'peach', 'plum', 'cherry', 'pear', 'melon'];
    const vegetables = ['broccoli', 'carrot', 'spinach', 'lettuce', 'tomato', 'pepper', 'onion', 'potato', 'bean', 'pea'];
    
    if (fruits.some(fruit => description.includes(fruit))) {
      category = 'fruit';
    } else if (vegetables.some(veg => description.includes(veg))) {
      category = 'vegetable';
    }

    return {
      name: usdaFood.description || 'Unknown',
      category: category,
      imageUrl: 'https://via.placeholder.com/150', // We'll improve this later
      nutrition: {
        calories: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0,
        fiber: nutrients.fiber || 0
      },
      usdaId: usdaFood.fdcId,
      dataSource: 'USDA'
    };
  }
}

module.exports = new USDAService();