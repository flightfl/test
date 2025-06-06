import wasmUrl from '../../build/release.wasm?url';

class WasmService {
  constructor() {
    this.instance = null;
    this.memory = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const wasmArrayBuffer = await fetch(wasmUrl).then(response => 
        response.arrayBuffer()
      );
      
      const wasmModule = await WebAssembly.instantiate(wasmArrayBuffer, {
        env: {
          abort: () => console.log("WASM abort called"),
        }
      });

      this.instance = wasmModule.instance;
      this.memory = this.instance.exports.memory;
      this.initialized = true;
      console.log('WASM module initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WASM:', error);
      console.log('Falling back to JavaScript calculations');
    }
  }

  calculateNutritionScore(nutrition) {
    if (!this.initialized) {
      console.warn('WASM not initialized, using fallback calculation');
      return this.fallbackNutritionScore(nutrition);
    }

    try {
      const score = this.instance.exports.calculateNutritionScore(
        nutrition.calories || 0,
        nutrition.protein || 0,
        nutrition.carbs || 0,
        nutrition.fat || 0,
        nutrition.fiber || 0
      );
      return Math.round(score * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.error('WASM calculation failed:', error);
      return this.fallbackNutritionScore(nutrition);
    }
  }

  calculateServingNutrition(nutrition, servingGrams, baseGrams = 100) {
    if (!this.initialized) {
      const multiplier = servingGrams / baseGrams;
      return {
        calories: Math.round((nutrition.calories || 0) * multiplier * 10) / 10,
        protein: Math.round((nutrition.protein || 0) * multiplier * 10) / 10,
        carbs: Math.round((nutrition.carbs || 0) * multiplier * 10) / 10,
        fat: Math.round((nutrition.fat || 0) * multiplier * 10) / 10,
        fiber: Math.round((nutrition.fiber || 0) * multiplier * 10) / 10,
      };
    }

    try {
      const resultPtr = this.instance.exports.calculateServingNutrition(
        nutrition.calories || 0,
        nutrition.protein || 0,
        nutrition.carbs || 0,
        nutrition.fat || 0,
        nutrition.fiber || 0,
        servingGrams,
        baseGrams
      );

      const resultArray = new Float32Array(this.memory.buffer, resultPtr, 5);
      
      return {
        calories: Math.round(resultArray[0] * 10) / 10,
        protein: Math.round(resultArray[1] * 10) / 10,
        carbs: Math.round(resultArray[2] * 10) / 10,
        fat: Math.round(resultArray[3] * 10) / 10,
        fiber: Math.round(resultArray[4] * 10) / 10,
      };
    } catch (error) {
      console.error('WASM serving calculation failed:', error);
      const multiplier = servingGrams / baseGrams;
      return {
        calories: Math.round((nutrition.calories || 0) * multiplier * 10) / 10,
        protein: Math.round((nutrition.protein || 0) * multiplier * 10) / 10,
        carbs: Math.round((nutrition.carbs || 0) * multiplier * 10) / 10,
        fat: Math.round((nutrition.fat || 0) * multiplier * 10) / 10,
        fiber: Math.round((nutrition.fiber || 0) * multiplier * 10) / 10,
      };
    }
  }

  // Fallback JavaScript calculation
  fallbackNutritionScore(nutrition) {
    const { calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0 } = nutrition;
    
    // Simplified scoring algorithm
    let score = 50; // Base score
    
    if (protein > 2) score += 15;
    if (fiber > 2) score += 15;
    if (fat < 5) score += 10;
    if (calories < 100) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  isAvailable() {
    return this.initialized;
  }
}

export default new WasmService();