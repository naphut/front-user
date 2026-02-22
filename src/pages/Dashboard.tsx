import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  Heart, 
  LogOut, 
  Edit2, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi, Order } from '../services/orderApi';
import { userApi, UserProfile } from '../services/userApi';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: '',
    address: '',
    city: '',
    profile_image: user?.profile_image || null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const currentUser = await userApi.getCurrentUser();
      setProfile(prevProfile => ({
        ...prevProfile,
        full_name: currentUser.full_name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        profile_image: currentUser.profile_image || null,
      }));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Fallback to localStorage if backend fails
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(prevProfile => ({
          ...prevProfile,
          ...parsedProfile
        }));
      }
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderApi.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      toast.loading('Updating profile...', { id: 'update' });
      
      // Prepare profile data for backend
      const profileData: UserProfile = {
        full_name: profile.full_name || undefined,
        phone: profile.phone || undefined,
        address: profile.address || undefined,
        city: profile.city || undefined,
        profile_image: profile.profile_image || undefined,
      };

      // Update profile on backend
      const updatedUser = await userApi.updateProfile(profileData);
      
      // Update local state
      setProfile(prevProfile => ({
        ...prevProfile,
        ...profileData
      }));
      
      // Save to localStorage as backup
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      toast.dismiss('update');
      toast.success('Profile updated successfully');
      
      // Show success alert
      setShowSuccessAlert(true);
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error: any) {
      toast.dismiss('update');
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB for better performance)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        toast.loading('Uploading image...', { id: 'upload' });
      };
      reader.onloadend = () => {
        toast.dismiss('upload');
        const result = reader.result as string;
        
        // Compress the image if it's too large (simple resize)
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Limit dimensions to reasonable size
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
          setProfile({...profile, profile_image: compressedImage});
          toast.success('Image uploaded successfully');
        };
        img.src = result;
      };
      reader.onerror = () => {
        toast.dismiss('upload');
        toast.error('Failed to upload image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setProfile({...profile, profile_image: null});
    toast.success('Image removed');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'shipped': return <Package className="w-4 h-4 text-blue-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" />, path: '/wishlist' },
  ];

  const userName = user?.full_name || user?.username || user?.email?.split('@')[0] || 'Guest';

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">My Account</h1>
          <p className="text-gray-300 mt-2">Welcome back, {userName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="relative w-20 h-20 mx-auto mb-3 group">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profile.profile_image ? (
                      <img 
                        src={profile.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-500" />
                    )}
                  </div>
                  <label className="absolute inset-0 w-full h-full rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center">
                    <Edit2 className="w-6 h-6 text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <h3 className="font-bold text-lg">{userName}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  item.path ? (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-black hover:text-white transition-all"
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                        activeTab === item.id 
                          ? "bg-black text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">{orders.length}</h3>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                      <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">
                        {orders.filter(o => o.status === 'delivered').length}
                      </h3>
                      <p className="text-sm text-gray-600">Delivered</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                      <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">0</h3>
                      <p className="text-sm text-gray-600">Wishlist</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                  {loadingOrders ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No orders yet</p>
                      <Link to="/products" className="text-black font-medium hover:underline mt-2 inline-block">
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <Link
                          key={order.id}
                          to={`/orders/${order.id}`}
                          className="block bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold">#{order.order_number}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <p className="font-bold mt-1">${order.total_amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                  
                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">Ready to start shopping?</p>
                      <Link to="/products" className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <Link to={`/orders/${order.id}`} className="text-lg font-bold hover:underline">
                                Order #{order.order_number}
                              </Link>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                              <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <span className="text-xl font-bold">${order.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Items: {order.items.length}</span>
                              <Link 
                                to={`/orders/${order.id}`}
                                className="text-black font-medium hover:underline flex items-center"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                  
                  {/* Profile Image Section */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-6">
                      <div className="relative group">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                          {profile.profile_image ? (
                            <img 
                              src={profile.profile_image} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-gray-500" />
                          )}
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <label className="cursor-pointer">
                            <Edit2 className="w-6 h-6 text-white" />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload a profile picture. Recommended: Square image, at least 200x200px. Max size: 2MB. Images will be compressed for optimal performance.
                        </p>
                        <div className="flex space-x-3">
                          <label className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer">
                            Choose Image
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          {profile.profile_image && (
                            <button
                              onClick={handleImageRemove}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Username
                      </label>
                      <input
                        type="text"
                        value={profile.username}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="+855 12 345 678"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="Street address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile({...profile, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="Phnom Penh"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProfileUpdate}
                    className="mt-6 px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition"
                  >
                    Update Profile
                  </button>

                  {/* Success Alert */}
                  {showSuccessAlert && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mt-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                          className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg"
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.h4 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="font-bold text-green-800 text-lg"
                          >
                            Profile Updated Successfully!
                          </motion.h4>
                          <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                            className="text-green-600"
                          >
                            Your changes have been saved to your account.
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;