const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Produce = require('./models/produceModel');

dotenv.config();

const basicProduce = {
  fruits: [
    // Most common fruits (globally popular and widely available)
    'apple', 'banana', 'orange', 'grape', 'strawberry', 'lemon', 'lime', 
    'pineapple', 'mango', 'watermelon', 'peach', 'pear', 'cherry', 'plum',
    'grapefruit', 'kiwi', 'coconut', 'avocado', 'blueberry', 'raspberry',
    'cantaloupe', 'honeydew', 'papaya', 'nectarine', 'apricot',
    
    // A fruits
    'acai', 'ackee', 'aronia', 'asian pear',
    
    // B fruits  
    'blackberry', 'boysenberry', 'breadfruit', 'bergamot',
    'bilberry', 'black sapote', 'buddha hand',
    
    // C fruits
    'clementine', 'cranberry', 'currant', 'cactus pear', 'cherimoya', 
    'cloudberry', 'calamansi', 'crabapple', 'cashew apple', 'custard apple',
    'carambola',
    
    // D fruits
    'date', 'dragon fruit', 'durian', 'damson', 'dewberry',
    
    // E fruits
    'elderberry', 'emu apple',
    
    // F fruits
    'fig', 'feijoa', 'finger lime',
    
    // G fruits
    'gooseberry', 'guava', 'goji berry', 'ground cherry', 'golden berry',
    'gac fruit', 'genip', 'goumi',
    
    // H fruits
    'huckleberry', 'horned melon', 'hala fruit', 'hackberry',
    
    // I fruits
    'ice cream bean', 'imbe', 'indian gooseberry',
    
    // J fruits
    'jackfruit', 'jujube', 'jabuticaba', 'jamaican cherry', 'jambul',
    
    // K fruits
    'kumquat', 'kiwano', 'kaffir lime', 'key lime', 'kakadu plum',
    'kei apple',
    
    // L fruits
    'lingonberry', 'lychee', 'longan', 'loquat', 'lemon myrtle',
    'langsat', 'lucuma', 'loganberry',
    
    // M fruits
    'mandarin', 'melon', 'mulberry', 'mamey', 'mangosteen', 'miracle fruit', 
    'marula', 'medlar', 'monstera', 'mountain apple', 'maypop', 'muscadine',
    
    // N fruits
    'noni', 'naranjilla', 'natal plum', 'nance',
    
    // O fruits
    'olive', 'orange berry', 'oregon grape',
    
    // P fruits
    'passion fruit', 'persimmon', 'plantain', 'pomegranate', 'pomelo', 
    'pawpaw', 'prickly pear', 'physalis', 'pitanga', 'pulasan',
    'pequi', 'peru cherry',
    
    // Q fruits
    'quince', 'quandong',
    
    // R fruits
    'raisin', 'rambutan', 'rose hip', 'red currant', 'rollinia',
    'rowan berry', 'rose apple',
    
    // S fruits
    'starfruit', 'sapodilla', 'soursop', 'sugar apple', 'salak',
    'surinam cherry', 'serviceberry', 'sea buckthorn',
    'sweet lime', 'santol', 'safou',
    
    // T fruits
    'tangerine', 'tamarillo', 'tamarind', 'tayberry', 'tomato',
    'tropical almond',
    
    // U fruits
    'ugli fruit', 'umbu', 'ume', 'uvaia',
    
    // V fruits
    'vanilla bean', 'velvet apple', 'voavanga',
    
    // W fruits
    'wood apple', 'white currant', 'white sapote', 'wampee',
    'waterberry', 'wax apple', 'wild cherry',
    
    // X fruits
    'ximenia',
    
    // Y fruits
    'yellow passion fruit', 'yuzu', 'yangmei', 'yacon',
    
    // Z fruits
    'ziziphus', 'zweigelt grape'
  ],
  
  vegetables: [
    // Most common vegetables (globally popular and widely available)
    'potato', 'onion', 'carrot', 'tomato', 'lettuce', 'broccoli', 'spinach',
    'bell pepper', 'corn', 'cucumber', 'garlic', 'cabbage', 'mushroom',
    'celery', 'pea', 'bean', 'squash', 'sweet potato', 'cauliflower',
    'eggplant', 'zucchini', 'radish', 'beet', 'asparagus', 'kale',
    
    // A fruits
    'artichoke', 'arugula', 'acorn squash', 'avocado leaves',
    
    // B fruits  
    'brussels sprouts', 'bok choy', 'bamboo shoots', 'basil', 'beet greens',
    'broccoli rabe', 'butter lettuce', 'butternut squash', 'black eyed pea',
    'banana pepper', 'broccoli romanesco', 'bitter melon', 'baby corn',
    
    // C fruits
    'chard', 'chive', 'cilantro', 'cassava', 'celeriac', 'chicory', 
    'chinese broccoli', 'collard greens', 'cress', 'cardoon', 'cabbage napa',
    'chili pepper', 'chinese cabbage', 'chinese spinach', 'calabash',
    
    // D fruits
    'daikon', 'delicata squash', 'dulse', 'dill',
    
    // E fruits
    'endive', 'edamame', 'elephant garlic', 'escarole',
    
    // F fruits
    'fennel', 'fava bean', 'fiddlehead fern', 'french bean',
    
    // G fruits
    'ginger', 'green bean', 'green onion', 'garlic scapes', 'galangal',
    'gai lan', 'gourds',
    
    // H fruits
    'hearts of palm', 'horseradish', 'hubbard squash', 'habanero pepper',
    'herbs', 'hijiki',
    
    // I fruits
    'iceberg lettuce', 'italian parsley',
    
    // J fruits
    'jerusalem artichoke', 'jicama', 'jalapeno', 'japanese eggplant',
    
    // K fruits
    'kohlrabi', 'kidney bean', 'kabocha squash', 'kelp', 'komatsuna',
    
    // L fruits
    'leek', 'lima bean', 'lemongrass', 'lotus root', 'lamb lettuce',
    
    // M fruits
    'mache', 'mizuna', 'mustard greens', 'mung bean', 'marrow',
    'morel mushroom', 'malanga',
    
    // N fruits
    'navy bean', 'nori', 'napa cabbage', 'new potato',
    
    // O fruits
    'okra', 'oregano', 'oyster mushroom', 'onion pearl',
    
    // P fruits
    'parsley', 'parsnip', 'pumpkin', 'plantain', 'pinto bean',
    'poblano pepper', 'portobello mushroom', 'purple cabbage',
    'purple potato', 'pickling cucumber',
    
    // Q fruits
    'quinoa leaves',
    
    // R fruits
    'radicchio', 'romaine lettuce', 'rutabaga', 'red cabbage', 'red pepper',
    'red onion', 'runner bean', 'rocket', 'ramps',
    
    // S fruits
    'scallion', 'snap pea', 'sorrel', 'spaghetti squash', 'swiss chard',
    'shallot', 'sage', 'serrano pepper', 'sugar snap pea', 'shiitake mushroom',
    'summer squash', 'sea beans', 'salsify', 'snow pea',
    
    // T fruits
    'turnip', 'taro', 'thyme', 'tomatillo', 'thai chili', 'turnip greens',
    'tuscan kale', 'tokyo turnip',
    
    // U fruits
    'ulluco', 'urad dal',
    
    // V fruits
    'vidalia onion', 'vermouth', 'vietnamese mint',
    
    // W fruits
    'watercress', 'water chestnut', 'wax bean', 'winter squash',
    'white bean', 'wasabi', 'wild rice', 'winged bean', 'white eggplant',
    
    // X fruits
    'xerophyte cactus',
    
    // Y fruits
    'yam', 'yard long bean', 'yellow squash', 'yacon', 'yellow onion',
    'yu choy',
    
    // Z fruits
    'zucchini blossom'
  ]
};

// USDA API configuration
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = process.env.USDA_API_KEY;

// Unsplash API configuration  
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
// PEXELS API configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Search USDA for a food item
async function searchUSDAFood(foodName) {
  try {
    const response = await axios.post(`${USDA_BASE_URL}/foods/search`, {
      query: foodName,
      dataType: ['Foundation', 'SR Legacy'],
      pageSize: 5,
      requireAllWords: false
    }, {
      params: { api_key: USDA_API_KEY },
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.foods && response.data.foods.length > 0) {
      // Return the first (most relevant) result
      return response.data.foods[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching USDA for ${foodName}:`, error.message);
    return null;
  }
}

// Get image from Unsplash or Pexels
async function getImage(foodName) {
  // Try Unsplash first
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: foodName,
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        console.log(`Got Unsplash image for ${foodName}`);
        return response.data.results[0].urls.regular;
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(`Unsplash rate limit hit for ${foodName}, trying Pexels...`);
      } else {
        console.log(`Unsplash failed for ${foodName}, trying Pexels...`);
      }
    }
  }
  
  // Fallback to Pexels
  if (PEXELS_API_KEY) {
    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        params: {
          query: foodName,
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });
      
      if (response.data.photos && response.data.photos.length > 0) {
        console.log(`Got Pexels image for ${foodName}`);
        return response.data.photos[0].src.medium;
      }
    } catch (error) {
      console.log(`Pexels also failed for ${foodName}: ${error.message}`);
    }
  }
}

function convertUSDAToOurFormat(usdaFood, category, imageUrl, originalName) {
  const nutrients = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  };
  
  if (usdaFood.foodNutrients) {
    usdaFood.foodNutrients.forEach(nutrient => {
      switch (nutrient.nutrientId) {
        case 1008: // Energy (calories)
          nutrients.calories = Math.round(nutrient.value || 0);
          console.log(`    Found calories: ${nutrient.value}`);
          break;
        case 1003: // Protein
          nutrients.protein = Math.round((nutrient.value || 0) * 100) / 100;
          console.log(`    Found protein: ${nutrient.value}`);
          break;
        case 1005: // Carbohydrates
          nutrients.carbs = Math.round((nutrient.value || 0) * 100) / 100;
          console.log(`    Found carbs: ${nutrient.value}`);
          break;
        case 1004: // Total lipid (fat)
          nutrients.fat = Math.round((nutrient.value || 0) * 100) / 100;
          console.log(`    Found fat: ${nutrient.value}`);
          break;
        case 1079: // Fiber
          nutrients.fiber = Math.round((nutrient.value || 0) * 100) / 100;
          console.log(`    Found fiber: ${nutrient.value}`);
          break;
      }
    });
  }

  const cleanName = originalName.charAt(0).toUpperCase() + originalName.slice(1);

  console.log(`    Final nutrients:`, nutrients);

  return {
    name: cleanName,
    category: category,
    imageUrl: imageUrl,
    nutrition: nutrients,
    dataSource: 'USDA',
    usdaId: usdaFood.fdcId
  };
}

// Process a single food item
async function processFoodItem(foodName, category) {
  console.log(`Processing: ${foodName} (${category})`);
  
  try {
    // Check if already exists (use clean name)
    const cleanName = foodName.charAt(0).toUpperCase() + foodName.slice(1);
    const existing = await Produce.findOne({ name: cleanName });
    
    if (existing) {
      console.log(`Already exists: ${existing.name}`);
      return;
    }

    // Search USDA
    const usdaFood = await searchUSDAFood(foodName);
    await delay(100); // Rate limiting

    // Get image
    const imageUrl = await getImage(foodName);
    await delay(100); // Rate limiting

    if (usdaFood) {
      // Convert and save with clean name
      const produceData = convertUSDAToOurFormat(usdaFood, category, imageUrl, foodName);
      await Produce.create(produceData);
      console.log(`  ✓ Added: ${produceData.name}`);
    } else {
      // Create with basic data if USDA not found
      await Produce.create({
        name: cleanName,
        category: category,
        imageUrl: imageUrl,
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        dataSource: 'manual'
      });
      console.log(`  ✓ Added (manual): ${cleanName}`);
    }
  } catch (error) {
    console.error(`  ✗ Error processing ${foodName}:`, error.message);
  }
}

// Main seeding function
async function seedProduce() {
  try {
    console.log('Starting produce seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let totalProcessed = 0;
    const totalItems = basicProduce.fruits.length + basicProduce.vegetables.length;

    // Process fruits
    console.log('\nProcessing fruits...');
    for (const fruit of basicProduce.fruits) {
      await processFoodItem(fruit, 'fruit'); // category is 'fruit'
      totalProcessed++;
      console.log(`Progress: ${totalProcessed}/${totalItems} (${Math.round(totalProcessed/totalItems*100)}%)`);
    }

    // Process vegetables
    console.log('\nProcessing vegetables...');
    for (const vegetable of basicProduce.vegetables) {
      await processFoodItem(vegetable, 'vegetable'); // category is 'vegetable'
      totalProcessed++;
      console.log(`Progress: ${totalProcessed}/${totalItems} (${Math.round(totalProcessed/totalItems*100)}%)`);
    }

    console.log('\nSeeding completed!');
    console.log(`Total items processed: ${totalProcessed}`);
    
    const finalCount = await Produce.countDocuments();
    console.log(`Items in database: ${finalCount}`);
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedProduce();
}

module.exports = { seedProduce, basicProduce };