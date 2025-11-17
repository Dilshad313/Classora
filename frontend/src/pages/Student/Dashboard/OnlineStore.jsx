import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, ShoppingCart, Heart, 
  Star, Plus, Minus, CreditCard, Package, Truck
} from 'lucide-react';

const OnlineStore = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  // Mock store products
  const products = [
    {
      id: 1,
      name: 'Mathematics Textbook - Class 10',
      category: 'books',
      price: 450,
      originalPrice: 500,
      image: '/api/placeholder/200/250',
      rating: 4.5,
      reviews: 128,
      inStock: true,
      description: 'Comprehensive mathematics textbook for Class 10 CBSE curriculum'
    },
    {
      id: 2,
      name: 'Scientific Calculator',
      category: 'supplies',
      price: 1200,
      originalPrice: 1500,
      image: '/api/placeholder/200/250',
      rating: 4.8,
      reviews: 89,
      inStock: true,
      description: 'Advanced scientific calculator with 240+ functions'
    },
    {
      id: 3,
      name: 'School Uniform - Shirt',
      category: 'uniform',
      price: 350,
      originalPrice: 400,
      image: '/api/placeholder/200/250',
      rating: 4.2,
      reviews: 67,
      inStock: true,
      description: 'Official school uniform shirt - white, cotton blend'
    },
    {
      id: 4,
      name: 'Physics Lab Manual',
      category: 'books',
      price: 280,
      originalPrice: 320,
      image: '/api/placeholder/200/250',
      rating: 4.3,
      reviews: 45,
      inStock: false,
      description: 'Complete physics lab manual with experiments and procedures'
    },
    {
      id: 5,
      name: 'Geometry Box Set',
      category: 'supplies',
      price: 180,
      originalPrice: 220,
      image: '/api/placeholder/200/250',
      rating: 4.6,
      reviews: 156,
      inStock: true,
      description: 'Complete geometry set with compass, protractor, and rulers'
    },
    {
      id: 6,
      name: 'School Bag - Premium',
      category: 'accessories',
      price: 1800,
      originalPrice: 2200,
      image: '/api/placeholder/200/250',
      rating: 4.7,
      reviews: 234,
      inStock: true,
      description: 'Ergonomic school bag with multiple compartments'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', count: products.length },
    { id: 'books', name: 'Books', count: products.filter(p => p.category === 'books').length },
    { id: 'supplies', name: 'Supplies', count: products.filter(p => p.category === 'supplies').length },
    { id: 'uniform', name: 'Uniform', count: products.filter(p => p.category === 'uniform').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-purple-600" />
            Online Store
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Purchase books, supplies, and school essentials
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative btn-secondary flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
          <button className="relative btn-primary flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart (₹{getTotalPrice()})
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  wishlist.some(item => item.id === product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                } hover:scale-110 transition-transform`}
              >
                <Heart className="w-4 h-4" />
              </button>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {cart.find(item => item.id === product.id) ? (
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => updateQuantity(product.id, cart.find(item => item.id === product.id).quantity - 1)}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-800 dark:text-gray-100 min-w-[2rem] text-center">
                      {cart.find(item => item.id === product.id).quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, cart.find(item => item.id === product.id).quantity + 1)}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="card text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your search or category filter
          </p>
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Cart Summary</h3>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-800 dark:text-gray-100">Total: ₹{getTotalPrice()}</span>
                <button className="btn-primary flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineStore;
