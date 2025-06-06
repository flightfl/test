import { useDroppable } from '@dnd-kit/core';
import { useComparison } from '../contexts/ComparisonContext';
import ComparisonCard from './ComparisonCard';

function ComparisonDropZone() {
  const { comparisonItems, clearComparison, maxItems } = useComparison();
  const { isOver, setNodeRef } = useDroppable({
    id: 'comparison-zone',
  });

  const style = {
    backgroundColor: isOver ? '#e8f5e8' : '#f8f9fa',
    borderColor: isOver ? '#4CAF50' : '#ddd',
    borderStyle: isOver ? 'solid' : 'dashed',
  };

  return (
    <div className="comparison-section">
      <div className="comparison-header">
        <h2>Compare Produce</h2>
        {comparisonItems.length > 0 && (
          <button onClick={clearComparison} className="clear-button">
            Clear All
          </button>
        )}
      </div>
      
      <div
        ref={setNodeRef}
        style={style}
        className="comparison-drop-zone"
      >
        {comparisonItems.length === 0 ? (
          <div className="drop-zone-empty">
            <div className="drop-zone-icon">📊</div>
            <p>Drag produce items here to compare them</p>
            <small>You can compare up to {maxItems} items at once</small>
          </div>
        ) : (
          <div className="comparison-grid">
            {comparisonItems.map((item) => (
              <ComparisonCard key={item._id} produce={item} />
            ))}
            
            {/* Show placeholder slots for remaining items */}
            {Array.from({ length: maxItems - comparisonItems.length }).map((_, index) => (
              <div key={`placeholder-${index}`} className="comparison-placeholder">
                <div className="placeholder-content">
                  <span>+</span>
                  <small>Drag item here</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonDropZone;