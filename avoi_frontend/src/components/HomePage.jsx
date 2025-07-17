import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, CheckCircle, Leaf, Award, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';

// Import new professional product images
import tonerImage from '../assets/product-balancing-toner-new.png';
import cleanserImage from '../assets/product-foaming-cleanser-new.png';
import moisturizerImage from '../assets/product-daily-moisturizer-new.png';
import nightCreamImage from '../assets/product-night-cream-new.png';
import retinolImage from '../assets/product-retinol-serum-new.png';
import vitaminCImage from '../assets/product-vitamin-c-serum-new.png';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const { addToCart } = useCart();

  // Product image mapping
  const productImages = {
    'Balancing Toner': tonerImage,
    'Gentle Foaming Cleanser': cleanserImage,
    'Hydrating Daily Moisturizer': moisturizerImage,
    'Nourishing Night Cream': nightCreamImage,
    'Retinol Renewal Serum': retinolImage,
    'Vitamin C Brightening Serum': vitaminCImage
  };

  useEffect(() => {
    // Fetch featured products from API
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS, {
          headers: {
            'X-Currency': 'NGN'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.products?.slice(0, 6) || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[product.name] || '/api/placeholder/300/300'
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setNewsletterMessage('Please enter your email address');
      setNewsletterSuccess(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterMessage('Please enter a valid email address');
      setNewsletterSuccess(false);
      return;
    }

    setNewsletterLoading(true);
    setNewsletterMessage('');

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail.trim().toLowerCase()
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterSuccess(true);
        setNewsletterMessage(data.message);
        setNewsletterEmail('');
      } else {
        setNewsletterSuccess(false);
        setNewsletterMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterSuccess(false);
      setNewsletterMessage('Network error. Please check your connection and try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #D43E06 0%, #F54708 30%, #E85D00 70%, #CC4A00 100%)',
        color: 'white',
        padding: '80px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px', 
          textAlign: 'center' 
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            fontFamily: 'Source Sans Pro, sans-serif'
          }}>
            Skincare Inspired by Nature
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '32px', 
            maxWidth: '600px', 
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Discover the power of natural ingredients with AVOI's premium skincare collection. 
            Rooted in heritage and perfected by science.
          </p>
          <Link 
            to="/products" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'white',
              color: '#F54708',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            Shop Now <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '48px',
            color: '#333',
            fontFamily: 'Source Sans Pro, sans-serif'
          }}>
            Featured Products
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
              Loading products...
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px' 
            }}>
              {featuredProducts.map((product) => (
                <div key={product.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    width: '100%',
                    height: '250px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <img 
                      src={productImages[product.name] || '/api/placeholder/300/300'} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: '#333'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      marginBottom: '16px',
                      lineHeight: '1.5'
                    }}>
                      {product.description}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        color: '#F54708' 
                      }}>
                        ₦{product.price}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        style={{
                          backgroundColor: '#F54708',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '48px',
            color: '#333',
            fontFamily: 'Source Sans Pro, sans-serif'
          }}>
            Why Choose AVOI?
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '32px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <Leaf style={{ 
                width: '48px', 
                height: '48px', 
                color: '#33CC33', 
                margin: '0 auto 16px auto' 
              }} />
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Natural Ingredients
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Carefully sourced natural ingredients that nourish and protect your skin.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Award style={{ 
                width: '48px', 
                height: '48px', 
                color: '#00B9E8', 
                margin: '0 auto 16px auto' 
              }} />
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Scientifically Proven
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Formulations backed by scientific research for maximum effectiveness.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Users style={{ 
                width: '48px', 
                height: '48px', 
                color: '#F54708', 
                margin: '0 auto 16px auto' 
              }} />
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Trusted by Thousands
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Join thousands of satisfied customers who trust AVOI for their skincare needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #F54708 0%, #FF6B35 25%, #FAA612 75%, #FFD700 100%)',
        color: 'white', 
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          opacity: 0.3
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-15%',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          opacity: 0.4
        }}></div>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            fontFamily: 'Source Sans Pro, sans-serif'
          }}>
            Stay Updated
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Subscribe to our newsletter for skincare tips and exclusive offers.
          </p>
          
          {/* Newsletter Message */}
          {newsletterMessage && (
            <div style={{
              maxWidth: '400px',
              margin: '0 auto 20px auto',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: newsletterSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${newsletterSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: newsletterSuccess ? '#059669' : '#DC2626',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {newsletterMessage}
            </div>
          )}
          
          <form onSubmit={handleNewsletterSubmit} style={{ 
            maxWidth: '400px', 
            margin: '0 auto', 
            display: 'flex',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={newsletterLoading}
              style={{
                flex: '1',
                padding: '12px 16px',
                border: 'none',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: newsletterLoading ? '#f3f4f6' : 'white'
              }}
            />
            <button 
              type="submit" 
              disabled={newsletterLoading}
              style={{
                backgroundColor: newsletterLoading ? '#9CA3AF' : 'white',
                color: newsletterLoading ? 'white' : '#F54708',
                padding: '12px 24px',
                border: 'none',
                fontWeight: '600',
                cursor: newsletterLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '100px'
              }}
            >
              {newsletterLoading ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

