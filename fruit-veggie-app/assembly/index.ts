// Nutrition Score Calculator
export function calculateNutritionScore(
  calories: f32,
  protein: f32,
  carbs: f32,
  fat: f32,
  fiber: f32,
  // targetCalories: f32 = 2000,
  proteinWeight: f32 = 0.3,
  fiberWeight: f32 = 0.25,
  fatWeight: f32 = 0.2,
  carbWeight: f32 = 0.15,
  calorieWeight: f32 = 0.1
): f32 {
  // Complex scoring algorithm with multiple calculations
  
  // Protein score (higher is better, diminishing returns)
  let proteinScore: f32 = 0.0;
  if (protein > 0.0) {
    proteinScore = Mathf.min(100.0, (protein / 3.0) * 25.0 + Mathf.log(protein + 1.0) * 10.0);
  }
  
  // Fiber score (higher is better)
  let fiberScore: f32 = 0.0;
  if (fiber > 0.0) {
    fiberScore = Mathf.min(100.0, fiber * 20.0 + Mathf.sqrt(fiber) * 15.0);
  }
  
  // Fat score (moderate amounts preferred)
  let fatScore: f32 = 0.0;
  if (fat >= 0.0) {
    if (fat <= 1.0) {
      fatScore = 90.0 - (fat * 10.0);
    } else if (fat <= 3.0) {
      fatScore = 80.0 - ((fat - 1.0) * 20.0);
    } else {
      fatScore = 40.0 - Mathf.min(40.0, (fat - 3.0) * 5.0);
    }
  }
  
  // Carb score (complex calculation based on context)
  let carbScore: f32 = 0.0;
  if (carbs >= 0.0) {
    let carbRatio: f32 = carbs / (carbs + protein + fat + 0.1);
    if (carbRatio <= 0.6) {
      carbScore = 70.0 + (0.6 - carbRatio) * 50.0;
    } else {
      carbScore = 70.0 - ((carbRatio - 0.6) * 100.0);
    }
  }
  
  // Calorie efficiency score
  let calorieScore: f32 = 0.0;
  if (calories > 0.0) {
    let calorieEfficiency: f32 = (protein * 4.0 + fiber * 2.0) / calories;
    calorieScore = Mathf.min(100.0, calorieEfficiency * 200.0);
  }
  
  // Weighted final score with normalization
  let rawScore: f32 = (proteinScore * proteinWeight) + 
                      (fiberScore * fiberWeight) +
                      (fatScore * fatWeight) +
                      (carbScore * carbWeight) +
                      (calorieScore * calorieWeight);
  
  // Apply sigmoid normalization for smooth scoring
  let normalizedScore: f32 = 100.0 / (1.0 + Mathf.exp(-(rawScore - 50.0) / 15.0));
  
  return normalizedScore;
}

// Serving size calculations
export function calculateServingNutrition(
  baseCalories: f32,
  baseProtein: f32,
  baseCarbs: f32,
  baseFat: f32,
  baseFiber: f32,
  servingGrams: f32,
  baseGrams: f32 = 100.0
): StaticArray<f32> {
  let multiplier: f32 = servingGrams / baseGrams;
  let result = new StaticArray<f32>(5);
  
  result[0] = baseCalories * multiplier;  // calories
  result[1] = baseProtein * multiplier;   // protein
  result[2] = baseCarbs * multiplier;     // carbs
  result[3] = baseFat * multiplier;       // fat
  result[4] = baseFiber * multiplier;     // fiber
  
  return result;
}

// Simple batch calculation function for extra computational work
export function calculateBatchScores(count: i32): StaticArray<f32> {
  let results = new StaticArray<f32>(count);
  
  for (let i = 0; i < count; i++) {
    // Simulate complex calculations with varying inputs
    let calories: f32 = 50.0 + <f32>i * 2.0;
    let protein: f32 = 1.0 + <f32>i * 0.5;
    let carbs: f32 = 10.0 + <f32>i * 1.5;
    let fat: f32 = 0.5 + <f32>i * 0.3;
    let fiber: f32 = 1.0 + <f32>i * 0.4;
    
    results[i] = calculateNutritionScore(calories, protein, carbs, fat, fiber);
  }
  
  return results;
}