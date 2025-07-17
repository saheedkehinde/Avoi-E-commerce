import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, CheckCircle, Leaf, Award, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';
import '../App.css';

// Import product images
import tonerImage from '../assets/product-balancing-toner.png';
import cleanserImage from '../assets/product-foaming-cleanser.png';
import moisturizerImage from '../assets/product-daily-moisturizer.png';
import nightCreamImage from '../assets/product-night-cream.png';
import retinolImage from '../assets/product-retinol-serum.png';
import vitaminCImage from '../assets/product-vitamin-c-serum.png';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Skincare Inspired by Nature
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the power of natural ingredients with AVOI's premium skincare collection. 
            Rooted in heritage and perfected by science.
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={productImages[product.name] || '/api/placeholder/300/300'} 
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        ₦{product.price}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
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
      <section className="benefits-section bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AVOI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="benefit-card text-center">
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
              <p className="text-gray-600">
                Carefully sourced natural ingredients that nourish and protect your skin.
              </p>
            </div>
            <div className="benefit-card text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Scientifically Proven</h3>
              <p className="text-gray-600">
                Formulations backed by scientific research for maximum effectiveness.
              </p>
            </div>
            <div className="benefit-card text-center">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3>
              <p className="text-gray-600">
                Join thousands of satisfied customers who trust AVOI for their skincare needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section bg-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">
            Subscribe to our newsletter for skincare tips and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

