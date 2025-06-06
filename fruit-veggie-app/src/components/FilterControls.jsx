function FilterControls({ filters, onFilterChange }) {
  const handleCategoryChange = (e) => {
    onFilterChange({
      ...filters,
      category: e.target.value
    });
  };

  const handleNutritionFilterChange = (e) => {
    onFilterChange({
      ...filters,
      nutritionFilter: e.target.value
    });
  };

  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="category-filter">Category:</label>
        <select 
          id="category-filter"
          value={filters.category} 
          onChange={handleCategoryChange}
        >
          <option value="all">All</option>
          <option value="fruit">Fruits</option>
          <option value="vegetable">Vegetables</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="nutrition-filter">Nutrition Focus:</label>
        <select 
          id="nutrition-filter"
          value={filters.nutritionFilter} 
          onChange={handleNutritionFilterChange}
        >
          <option value="none">No Filter</option>
          <option value="highProtein">High Protein (&gt;2g)</option>
          <option value="lowCalorie">Low Calorie (&lt;50 cal)</option>
          <option value="highFiber">High Fiber (&gt;2g)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterControls;