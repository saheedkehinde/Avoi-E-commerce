import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, LogIn, UserPlus, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logoSvg from '../assets/AVOI3_104017.svg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Shop', href: '/products', icon: '🛍️' },
    { name: 'Categories', href: '/products', icon: '📂' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Contact', href: '/contact', icon: '📞' },
  ];

  const headerStyle = {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const headerContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  };

  const logoImageStyle = {
    height: '40px',
    width: 'auto'
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px'
  };

  const navLinkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const navLinkHoverStyle = {
    color: '#F54708',
    background: '#fff5f0'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const searchFormStyle = {
    position: 'relative'
  };

  const searchInputStyle = {
    width: '280px',
    padding: '10px 15px 10px 45px',
    border: '2px solid #e5e7eb',
    borderRadius: '25px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const searchInputFocusStyle = {
    borderColor: '#F54708',
    boxShadow: '0 0 0 3px rgba(245, 71, 8, 0.1)'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '18px',
    height: '18px'
  };

  const iconButtonStyle = {
    position: 'relative',
    padding: '10px',
    color: '#374151',
    background: 'none',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const iconButtonHoverStyle = {
    color: '#F54708',
    background: '#fff5f0'
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#F54708',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white'
  };

  const userMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '10px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    minWidth: '220px',
    padding: '10px 0',
    zIndex: 1000
  };

  const userMenuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: '#374151',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  };

  const userMenuItemHoverStyle = {
    background: '#f9fafb'
  };

  const mobileMenuStyle = {
    display: 'block',
    padding: '20px 0',
    borderTop: '1px solid #e5e7eb',
    background: 'white'
  };

  const mobileNavStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const mobileNavLinkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
    padding: '12px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={headerContentStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <img src={logoSvg} alt="AVOI Logo" style={logoImageStyle} />
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ ...navStyle, display: window.innerWidth >= 768 ? 'flex' : 'none' }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={navLinkStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, navLinkStyle)}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={actionsStyle}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ ...searchFormStyle, display: window.innerWidth >= 640 ? 'block' : 'none' }}>
              <input
                type="text"
                placeholder="Search skincare products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
                onFocus={(e) => Object.assign(e.target.style, searchInputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, searchInputStyle)}
              />
              <Search style={searchIconStyle} />
            </form>

            {/* Wishlist */}
            <button
              style={iconButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, iconButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, iconButtonStyle)}
              title="Wishlist"
            >
              <Heart size={20} />
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              style={iconButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, iconButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, iconButtonStyle)}
              title="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {getCartItemCount() > 0 && (
                <span style={cartBadgeStyle}>
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={iconButtonStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, iconButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, iconButtonStyle)}
                title={isLoggedIn ? 'Account Menu' : 'Login / Register'}
              >
                <User size={20} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div style={userMenuStyle}>
                  {isLoggedIn ? (
                    <>
                      <div style={{ ...userMenuItemStyle, borderBottom: '1px solid #e5e7eb', marginBottom: '10px', paddingBottom: '15px' }}>
                        <User size={16} />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13px' }}>Logged in as:</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{userEmail}</div>
                        </div>
                      </div>
                      
                      <Link
                        to="/account"
                        style={userMenuItemStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, userMenuItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, userMenuItemStyle)}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} />
                        My Account
                      </Link>
                      
                      <Link
                        to="/orders"
                        style={userMenuItemStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, userMenuItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, userMenuItemStyle)}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart size={16} />
                        My Orders
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        style={{ ...userMenuItemStyle, width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                        onMouseEnter={(e) => Object.assign(e.target.style, userMenuItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, { ...userMenuItemStyle, width: '100%', border: 'none', background: 'none', textAlign: 'left' })}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        style={userMenuItemStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, userMenuItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, userMenuItemStyle)}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LogIn size={16} />
                        Login
                      </Link>
                      
                      <Link
                        to="/register"
                        style={userMenuItemStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, userMenuItemHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, userMenuItemStyle)}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserPlus size={16} />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ ...iconButtonStyle, display: window.innerWidth >= 768 ? 'none' : 'flex' }}
              onMouseEnter={(e) => Object.assign(e.target.style, iconButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, iconButtonStyle)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={mobileMenuStyle}>
            <nav style={mobileNavStyle}>
              {/* Mobile Search */}
              <form onSubmit={handleSearch} style={{ marginBottom: '15px' }}>
                <div style={searchFormStyle}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ ...searchInputStyle, width: '100%' }}
                  />
                  <Search style={searchIconStyle} />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  style={mobileNavLinkStyle}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

