import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { logout } from '../services/api';

function Navbar() {
  const { user, setUser, loading } = useUser();
  
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🥬</span>
            <span className="brand-text">ProduceApp</span>
          </Link>
        </div>
        
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/favorites" className="nav-link">Favorites</Link></li>

          {!loading && (
            user ? (
              <>
                <li className="user-greeting">
                  <span className="user-icon">👋</span>
                  <span>Welcome, {user.name}!</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login" className="login-link">Login</Link></li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;