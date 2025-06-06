import { useState, useEffect } from 'react';
import { getProduceItems } from '../services/api';
import FilterControls from '../components/FilterControls';
import DraggableProduceCard from '../components/DraggableProduceCard';
import ComparisonDropZone from '../components/ComparisonDropZone';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    nutritionFilter: 'none'
  });
  const [allProduce, setAllProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduce = async () => {
      try {
        setLoading(true);
        const data = await getProduceItems();
        setAllProduce(data);
        setError(null);
      } catch (err) {
        setError('Failed to load produce data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduce();
  }, []);
  
  const filteredProduce = allProduce.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || item.category === filters.category;
    
    let matchesNutrition = true;
    switch (filters.nutritionFilter) {
      case 'highProtein':
        matchesNutrition = item.nutrition.protein > 2;
        break;
      case 'lowCalorie':
        matchesNutrition = item.nutrition.calories < 50;
        break;
      case 'highFiber':
        matchesNutrition = item.nutrition.fiber > 2;
        break;
      default:
        matchesNutrition = true;
    }
    
    return matchesSearch && matchesCategory && matchesNutrition;
  });
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="home-page">
      <section>
        <header>
          <h1>Fruits & Vegetables Explorer</h1>
          <p>Discover nutrition, compare foods, and learn with AI-powered insights</p>
        </header>
        
        <div className="search-and-filters">
          <div className="search-section">
            <input 
              type="text" 
              placeholder="Search for produce..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for produce"
            />
          </div>
          
          <FilterControls 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </div>
        
        <div className="results-info">
          <p>Showing {filteredProduce.length} of {allProduce.length} items</p>
        </div>

        {loading ? (
          <div>Loading produce data...</div>
        ) : (
          <>
            <ComparisonDropZone />
            
            <div className="produce-grid">
              {filteredProduce.map(item => (
                <DraggableProduceCard key={item._id} produce={item} />
              ))}
            </div>
          </>
        )}

        {/* disclaimer section */}
        <div className="disclaimer">
          <div className="disclaimer-content">
            <h4>📸 About Images & Data</h4>
            <p>
              <strong>Images:</strong> Sourced from <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a> and <a href="https://pexels.com" target="_blank" rel="noopener">Pexels</a>. 
              Some images may not perfectly represent the actual produce item.
            </p>
            <p>
              <strong>Nutrition Data:</strong> Sourced from <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener">USDA Food Data Central</a>. 
              Values are per 100g serving, and may be incorrect.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;