import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFromFavorites } from '../services/api';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFavorites();
  }, []);
  
  const handleRemoveFromFavorites = async (id) => {
    try {
      await removeFromFavorites(id);
      // Refresh favorites after removing
      fetchFavorites();
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };
  
  if (loading) {
    return <div>Loading favorites...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
      <h1>Your Favorites</h1>
      
      {favorites.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="produce-grid">
          {favorites.map(item => (
            <article key={item._id} className="produce-card">
              <img src={item.imageUrl} alt={item.name} />
              <h2>{item.name}</h2>
              <p>{item.category}</p>
              <Link to={`/detail/${item._id}`}>View Details</Link>
              <button 
                onClick={() => handleRemoveFromFavorites(item._id)}
                className="remove-favorite"
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;