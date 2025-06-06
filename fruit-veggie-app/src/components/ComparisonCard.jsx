import { useComparison } from '../contexts/ComparisonContext';
import { Link } from 'react-router-dom';

function ComparisonCard({ produce }) {
  const { removeFromComparison } = useComparison();

  return (
    <div className="comparison-card">
      <button 
        onClick={() => removeFromComparison(produce._id)}
        className="remove-button"
        aria-label={`Remove ${produce.name} from comparison`}
      >
        ×
      </button>
      
      <img src={produce.imageUrl} alt={produce.name} />
      <h3>{produce.name}</h3>
      <div className="category-badge">{produce.category}</div>
      
      <div className="nutrition-comparison">
        <div className="nutrition-row">
          <span className="label">Calories</span>
          <span className="value">{produce.nutrition.calories}</span>
        </div>
        <div className="nutrition-row">
          <span className="label">Protein</span>
          <span className="value">{produce.nutrition.protein}g</span>
        </div>
        <div className="nutrition-row">
          <span className="label">Carbs</span>
          <span className="value">{produce.nutrition.carbs}g</span>
        </div>
        <div className="nutrition-row">
          <span className="label">Fat</span>
          <span className="value">{produce.nutrition.fat}g</span>
        </div>
        <div className="nutrition-row">
          <span className="label">Fiber</span>
          <span className="value">{produce.nutrition.fiber}g</span>
        </div>
      </div>
      
      <Link to={`/detail/${produce._id}`} className="view-details-btn">
        View Details
      </Link>
    </div>
  );
}

export default ComparisonCard;