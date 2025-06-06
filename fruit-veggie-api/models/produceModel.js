const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 }
  },
  { _id: false }
);

const produceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String,
      required: true,
      enum: ['fruit', 'vegetable', 'other']
    },
    imageUrl: String,
    nutrition: nutritionSchema,
    translations: {
      type: Map,
      of: String
    },
    aiInsights: [String],
    // USDA-specific fields
    usdaId: {
      type: Number,
      sparse: true // Allows multiple null values
    },
    dataSource: {
      type: String,
      enum: ['manual', 'USDA'],
      default: 'manual'
    }
  },
  { timestamps: true }
);

const Produce = mongoose.model('Produce', produceSchema);

module.exports = Produce;