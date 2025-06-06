import { createContext, useState, useContext } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [comparisonItems, setComparisonItems] = useState([]);
  const maxItems = 3; // Maximum items to compare
  
  const addToComparison = (item) => {
    setComparisonItems(prev => {
      // Don't add if already exists
      if (prev.find(existing => existing._id === item._id)) {
        return prev;
      }
      
      // If at max capacity, replace the oldest item
      if (prev.length >= maxItems) {
        return [...prev.slice(1), item];
      }
      
      return [...prev, item];
    });
  };
  
  const removeFromComparison = (itemId) => {
    setComparisonItems(prev => prev.filter(item => item._id !== itemId));
  };
  
  const clearComparison = () => {
    setComparisonItems([]);
  };
  
  return (
    <ComparisonContext.Provider value={{
      comparisonItems,
      addToComparison,
      removeFromComparison,
      clearComparison,
      maxItems
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => useContext(ComparisonContext);