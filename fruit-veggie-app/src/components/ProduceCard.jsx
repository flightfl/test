import { Link } from 'react-router-dom';

function ProduceCard({ item }) {
  return (
    <div className="produce-card">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.category}</p>
      <Link to={`/detail/${item.id}`}>View Details</Link>
    </div>
  );
}

export default ProduceCard;