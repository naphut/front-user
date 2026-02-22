import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Heart, Globe, Truck, Bell, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { totalItems, lastAddedItem } = useCart();
  const wishlistContext = useWishlist();
  const wishlistItems = Array.isArray(wishlistContext) ? wishlistContext : (wishlistContext?.items || []);
  
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'EN' | 'KH'>('EN');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', type: 'order', time: '2 min ago', read: false },
    { id: 2, message: 'Product back in stock', type: 'product', time: '1 hour ago', read: false },
    { id: 3, message: 'Special offer: 20% off', type: 'promo', time: '3 hours ago', read: true }
  ]);

  useEffect(() => {
    if (lastAddedItem > 0) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: language === 'EN' ? 'Home' : 'ទំព័រដើម', path: '/' },
    { name: language === 'EN' ? 'Shop All' : 'ហាងទាំងអស់', path: '/products' },
    { name: language === 'EN' ? 'T-Shirts' : 'អាវយឺត', path: '/products?category=t-shirts' },
    { name: language === 'EN' ? 'Polo Shirts' : 'អាវប៉ូឡូ', path: '/products?category=polo-shirts' },
    { name: language === 'EN' ? 'Delivery' : 'ការដឹកជញ្ជូន', path: '/tracking', icon: <Truck className="w-4 h-4 mr-1" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12">
                <div className="w-5 h-5 bg-white rounded-full" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black">LUMINA</span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="group flex items-center text-sm font-bold text-black/50 hover:text-black transition-all duration-300 relative py-2"
              >
                {link.icon}
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-5">
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'KH' : 'EN')}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-xs font-bold"
            >
              <Globe className="w-4 h-4" />
              <span>{language}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300 relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
              
              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-black/5 p-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-black/5 mb-1 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-black">Notifications</h3>
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-black/50">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={cn(
                                "px-4 py-3 border-b border-black/5 hover:bg-black/5 transition cursor-pointer",
                                !notification.read && "bg-blue-50"
                              )}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                  notification.type === 'order' && "bg-green-100",
                                  notification.type === 'product' && "bg-blue-100",
                                  notification.type === 'promo' && "bg-yellow-100"
                                )}>
                                  {notification.type === 'order' && <Package className="w-4 h-4 text-green-600" />}
                                  {notification.type === 'product' && <Heart className="w-4 h-4 text-blue-600" />}
                                  {notification.type === 'promo' && <Bell className="w-4 h-4 text-yellow-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-black truncate">{notification.message}</p>
                                  <p className="text-xs text-black/50 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/wishlist" className="p-2.5 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300 relative group">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Heart className={cn("w-5 h-5", wishlistItems.length > 0 && "fill-red-500 text-red-500")} />
              </motion.div>
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2.5 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300 relative group">
              <motion.div 
                animate={isCartBouncing ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.2 }} 
                whileTap={{ scale: 0.8 }}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
              {totalItems > 0 && (
                <motion.span 
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hidden sm:block p-2.5 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-black/5 p-2 z-50 overflow-hidden"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-3 border-b border-black/5 mb-1">
                            <p className="text-xs font-black uppercase tracking-widest text-black/40">Signed in as</p>
                            <p className="text-sm font-bold text-black truncate">{user?.email}</p>
                            <p className="text-xs text-black/60 mt-1">{user?.full_name || 'User'}</p>
                          </div>
                          <Link 
                            to="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-black/5 rounded-xl transition flex items-center"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Dashboard
                          </Link>
                          <Link 
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-black/5 rounded-xl transition flex items-center"
                          >
                            <ShoppingCart className="w-4 h-4 mr-3" />
                            My Orders
                          </Link>
                          <Link 
                            to="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-black/5 rounded-xl transition flex items-center"
                          >
                            <Heart className="w-4 h-4 mr-3" />
                            My Wishlist
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition flex items-center"
                          >
                            <X className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/login" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex w-full items-center px-4 py-2.5 text-sm font-bold text-black hover:bg-black/5 rounded-xl transition"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Sign In
                          </Link>
                          <Link 
                            to="/register" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex w-full items-center px-4 py-2.5 text-sm font-bold text-black hover:bg-black/5 rounded-xl transition"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              className="lg:hidden p-2.5 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Animated Expansion */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-6 flex justify-center">
                <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
                  <input
                    type="text"
                    placeholder={language === 'EN' ? "Search products..." : "ស្វែងរកផលិតផល..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 bg-black/5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-300 group-hover:bg-black/10"
                  />
                  <button type="submit" className="absolute right-4 top-3.5 p-1.5 bg-black text-white rounded-xl hover:bg-black/80 transition-all">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu - Slide Down */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="lg:hidden bg-white border-b border-black/5 shadow-2xl overflow-hidden relative z-50"
            >
              <div className="px-6 py-8 space-y-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link 
                      to={link.path} 
                      className="flex items-center text-xl font-black text-black hover:text-black/60 transition-all" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon && <span className="mr-3">{link.icon}</span>}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-8 flex flex-col space-y-4">
                  <button 
                    onClick={() => {
                      setLanguage(language === 'EN' ? 'KH' : 'EN');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-sm font-bold text-black/60"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{language === 'EN' ? 'Switch to Khmer' : 'ប្តូរទៅភាសាអង់គ្លេស'}</span>
                  </button>
                  <div className="flex items-center space-x-3 text-sm font-bold text-black/60">
                    <User className="w-5 h-5" />
                    {isAuthenticated ? (
                      <button onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}>
                        {language === 'EN' ? 'Sign Out' : 'ចាកចេញ'}
                      </button>
                    ) : (
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        {language === 'EN' ? 'Sign In' : 'ចូលគណនី'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;