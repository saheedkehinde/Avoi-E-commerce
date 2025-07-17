import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';
import '../App.css';

// Import product images
import balancingTonerImg from '../assets/product-balancing-toner-new.png';
import foamingCleanserImg from '../assets/product-foaming-cleanser-new.png';
import dailyMoisturizerImg from '../assets/product-daily-moisturizer-new.png';
import nightCreamImg from '../assets/product-night-cream-new.png';
import retinolSerumImg from '../assets/product-retinol-serum-new.png';
import vitaminCSerumImg from '../assets/product-vitamin-c-serum-new.png';

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Product image mapping
  const productImages = {
    'Balancing Toner': balancingTonerImg,
    'Gentle Foaming Cleanser': foamingCleanserImg,
    'Hydrating Daily Moisturizer': dailyMoisturizerImg,
    'Nourishing Night Cream': nightCreamImg,
    'Retinol Renewal Serum': retinolSerumImg,
    'Vitamin C Brightening Serum': vitaminCSerumImg
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        headers: {
          'X-Currency': 'NGN'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return (b.average_rating || 0) - (a.average_rating || 0);
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[product.name] || '/api/placeholder/300/300',
      quantity: 1
    });
  };

  const getProductImage = (productName) => {
    return productImages[productName] || '/api/placeholder/300/300';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600 font-medium">Loading our amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-6">
            Our Premium Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our complete range of natural skincare products, carefully crafted with the finest ingredients 
            to nourish and transform your skin. Each product is designed to deliver exceptional results while 
            honoring the power of nature.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-orange-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400" />
              <input
                type="text"
                placeholder="Search for your perfect product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white text-gray-700"
              >
                <option value="name">Sort by Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Enhanced View Mode */}
              <div className="flex border-2 border-orange-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Enhanced Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-4 border-2 rounded-xl transition-all duration-300 ${
                  showFilters 
                    ? 'border-orange-400 bg-orange-50 text-orange-600' 
                    : 'border-orange-200 hover:bg-orange-50 text-gray-600'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Enhanced Filters Panel */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t border-orange-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range (₦)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300"
                    />
                    <span className="text-gray-500 font-medium">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="w-full px-3 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setPriceRange([0, 100000]);
                      setSortBy('name');
                    }}
                    className="w-full px-6 py-3 border-2 border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Results Count */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 font-medium">
            Showing <span className="text-orange-600 font-bold">{sortedProducts.length}</span> of <span className="text-orange-600 font-bold">{products.length}</span> premium products
          </p>
        </div>

        {/* Enhanced Products Grid/List */}
        {sortedProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            : 'space-y-8'
          }>
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Enhanced Product Image */}
                <div className={`${viewMode === 'list' ? 'w-64 h-64' : 'aspect-square'} bg-gradient-to-br from-orange-50 to-orange-100 relative group overflow-hidden`}>
                  <img
                    src={getProductImage(product.name)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Enhanced Overlay Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <div className="flex space-x-3">
                      <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110">
                        <Heart className="h-5 w-5 text-orange-600" />
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
                      >
                        <Eye className="h-5 w-5 text-orange-600" />
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Sale Badge */}
                  {product.sale_price && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      SALE
                    </div>
                  )}
                </div>

                {/* Enhanced Product Info */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className={viewMode === 'list' ? 'flex justify-between items-start h-full' : ''}>
                    <div className={viewMode === 'list' ? 'flex-1 pr-6' : ''}>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                        <Link to={`/product/${product.id}`} className="hover:text-orange-600 transition-colors duration-300">
                          {product.name}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      {/* Enhanced Rating */}
                      {product.average_rating && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.average_rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2 font-medium">
                            ({product.review_count || 0} reviews)
                          </span>
                        </div>
                      )}

                      {/* Enhanced Price */}
                      <div className="flex items-center mb-6">
                        {product.sale_price ? (
                          <>
                            <span className="text-2xl font-bold text-orange-600">
                              ₦{product.sale_price.toLocaleString()}
                            </span>
                            <span className="text-lg text-gray-500 line-through ml-3">
                              ₦{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-orange-600">
                            ₦{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Actions */}
                    <div className={viewMode === 'list' ? 'flex flex-col space-y-3' : ''}>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </button>
                      
                      {viewMode === 'list' && (
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full border-2 border-orange-500 text-orange-600 py-3 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 text-center"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-orange-300 mb-6">
              <Search className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your search or filter settings.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange([0, 100000]);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

