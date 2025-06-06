import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduceById, addToFavorites, generateHealthInsights, generateTranslations } from '../services/api';
import wasmService from '../services/wasmService';

function Detail() {
  const { id } = useParams();
  const [produce, setProduce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState(null);
  const [healthInsights, setHealthInsights] = useState([]);
  const [translations, setTranslations] = useState({});
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingTranslations, setLoadingTranslations] = useState(false);

  const [nutritionScore, setNutritionScore] = useState(null);
  const [servingSize, setServingSize] = useState(100);
  const [adjustedNutrition, setAdjustedNutrition] = useState(null);
  
  useEffect(() => {
    const fetchProduceDetails = async () => {
      try {
        setLoading(true);
        const data = await getProduceById(id);
        setProduce(data);

        // Load existing AI data if available
        if (data.aiInsights && data.aiInsights.length > 0) {
          setHealthInsights(data.aiInsights);
        }
        if (data.translations && Object.keys(data.translations).length > 0) {
          setTranslations(data.translations);
        }

        setError(null);
      } catch (err) {
        setError('Failed to load produce details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduceDetails();
  }, [id]);

  useEffect(() => {
    const initializeWasm = async () => {
      await wasmService.initialize();
      if (produce && wasmService.isAvailable()) {
        const score = wasmService.calculateNutritionScore(produce.nutrition);
        setNutritionScore(score);
      }
    };
    
    initializeWasm();
  }, [produce]);
  
  const handleServingSizeChange = (newSize) => {
    setServingSize(newSize);
    if (produce) {
      const adjusted = wasmService.calculateServingNutrition(produce.nutrition, newSize);
      setAdjustedNutrition(adjusted);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await addToFavorites(id);
      setFavoriteStatus('Added to favorites!');
    } catch (err) {
      setFavoriteStatus('Error adding to favorites, please try login in first');
      console.error(err);
    }
  };
  
  const handleGenerateInsights = async () => {
    try {
      setLoadingInsights(true);
      const result = await generateHealthInsights(id);
      setHealthInsights(result.insights);
    } catch (err) {
      console.error('Error generating insights:', err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleGenerateTranslations = async () => {
    try {
      setLoadingTranslations(true);
      const result = await generateTranslations(id);
      setTranslations(result.translations);
    } catch (err) {
      console.error('Error generating translations:', err);
    } finally {
      setLoadingTranslations(false);
    }
  };

  if (loading) {
    return <div>Loading details...</div>;
  }
  
  if (error || !produce) {
    return <div>Error: {error || 'Produce not found'}</div>;
  }
  
  return (
    <div>
      <Link to="/" className="back-link">&larr; Back to all produce</Link>
      
      <div className="produce-detail">
        <img 
          src={produce.imageUrl} 
          alt={produce.name} 
          className="produce-detail-image"
        />
        
        <div className="produce-detail-info">
          <h1>{produce.name}</h1>
          <p className="category">Category: <strong>{produce.category}</strong></p>
          
          {/* Nutrition Information */}
          <section className="nutrition-section">
            <h2>Nutrition Information (per 100g)</h2>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-value">{produce.nutrition.calories}</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">{produce.nutrition.protein}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">{produce.nutrition.carbs}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">{produce.nutrition.fat}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fiber</span>
                <span className="nutrition-value">{produce.nutrition.fiber}g</span>
              </div>
            </div>
          </section>

          {/* WASM-Powered Features */}
          <section className="wasm-section">
            <h2>🚀 Smart Nutrition Analysis</h2>
            
            {nutritionScore !== null && (
              <div className="nutrition-score">
                <h3>Nutrition Score</h3>
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-number">{nutritionScore}</span>
                    <span className="score-label">/100</span>
                  </div>
                  <div className="score-description">
                    <p>
                      {nutritionScore >= 80 ? '🌟 Excellent nutritional profile!' :
                      nutritionScore >= 60 ? '👍 Good nutritional value' :
                      nutritionScore >= 40 ? '⚖️ Moderate nutritional value' :
                      '⚠️ Consider in moderation'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="serving-calculator">
              <h3>Serving Size Calculator</h3>
              <div className="serving-controls">
                <label htmlFor="serving-size">Serving size (grams):</label>
                <input
                  id="serving-size"
                  type="number"
                  min="1"
                  max="1000"
                  value={servingSize}
                  onChange={(e) => handleServingSizeChange(Number(e.target.value))}
                />
              </div>
              
              {adjustedNutrition && (
                <div className="adjusted-nutrition">
                  <h4>Nutrition for {servingSize}g serving:</h4>
                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="nutrition-label">Calories</span>
                      <span className="nutrition-value">{adjustedNutrition.calories}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Protein</span>
                      <span className="nutrition-value">{adjustedNutrition.protein}g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Carbs</span>
                      <span className="nutrition-value">{adjustedNutrition.carbs}g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Fat</span>
                      <span className="nutrition-value">{adjustedNutrition.fat}g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Fiber</span>
                      <span className="nutrition-value">{adjustedNutrition.fiber}g</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="wasm-badge">
              <small>⚡ Powered by WebAssembly for fast calculations</small>
            </div>
          </section>  

          {/* AI Health Insights */}
          <section className="ai-section">
            <h2>Health Benefits</h2>
            {healthInsights.length > 0 ? (
              <div className="health-insights">
                {healthInsights.map((insight, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-number">{index + 1}</span>
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ai-generate">
                <p>Discover the health benefits of {produce.name}!</p>
                <button 
                  onClick={handleGenerateInsights}
                  disabled={loadingInsights}
                  className="ai-button"
                >
                  {loadingInsights ? 'Generating...' : 'Get Health Insights'}
                </button>
              </div>
            )}
          </section>

          {/* AI Translations */}
          <section className="ai-section">
            <h2>Learn in Different Languages</h2>
            {Object.keys(translations).length > 0 ? (
              <div className="translations">
                {Object.entries(translations).map(([language, translation]) => (
                  <div key={language} className="translation-item">
                    <span className="language">{language.charAt(0).toUpperCase() + language.slice(1)}:</span>
                    <span className="translation">{translation}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ai-generate">
                <p>Learn how to say "{produce.name}" in other languages!</p>
                <button 
                  onClick={handleGenerateTranslations}
                  disabled={loadingTranslations}
                  className="ai-button"
                >
                  {loadingTranslations ? 'Translating...' : 'Get Translations'}
                </button>
              </div>
            )}
          </section>

          {/* Actions */}
          <div className="actions">
            <button onClick={handleAddToFavorites} className="favorite-button">
              Add to Favorites
            </button>
          </div>
          
          {favoriteStatus && <p className="status-message">{favoriteStatus}</p>}
        </div>
      </div>
    </div>
  );
}

export default Detail;