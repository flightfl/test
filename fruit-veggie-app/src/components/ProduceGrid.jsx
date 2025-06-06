import { useState, useEffect } from 'react';
import ProduceCard from './ProduceCard';

// Mock data - will be replaced with API calls later
const mockData = [
  {
    id: '1',
    name: 'Apple',
    category: 'fruit',
    image: 'https://placehold.co/600x400?text=test'
  },
  {
    id: '2',
    name: 'Broccoli',
    category: 'vegetable',
    image: 'https://placehold.co/600x400?text=test'
  }
];

function ProduceGrid({ searchTerm }) {
  const [produce, setProduce] = useState([]);
  
  useEffect(() => {
    // Filter mock data based on search term
    const filtered = mockData.filter(item => 
      item.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );
    setProduce(filtered);
    
    // Later this will be replaced with API call
  }, [searchTerm]);
  
  return (
    <div className="produce-grid">
      {produce.map(item => (
        <ProduceCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ProduceGrid;