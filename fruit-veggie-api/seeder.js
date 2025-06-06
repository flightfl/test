const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Produce = require('./models/produceModel');

dotenv.config();

const produceData = [
  {
    name: 'Apple',
    category: 'fruit',
    imageUrl: 'https://placehold.co/600x400?text=test',
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4
    }
  },
  {
    name: 'Banana',
    category: 'fruit',
    imageUrl: 'https://placehold.co/600x400?text=test',
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6
    }
  },
  {
    name: 'Broccoli',
    category: 'vegetable',
    imageUrl: 'https://placehold.co/600x400?text=test',
    nutrition: {
      calories: 31,
      protein: 2.5,
      carbs: 6,
      fat: 0.3,
      fiber: 2.4
    }
  },
  {
    name: 'Carrot',
    category: 'vegetable',
    imageUrl: 'https://placehold.co/600x400?text=test',
    nutrition: {
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      fiber: 2.8
    }
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      // Delete existing data
      await Produce.deleteMany();
      
      // Insert new data
      await Produce.insertMany(produceData);
      
      console.log('Data imported successfully!');
      process.exit();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });