import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  QrCode, 
  Smartphone,
  MapPin,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { orderApi } from '../services/orderApi';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/paymentApi';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'khqr'>('card');
  const [qrData, setQrData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // បញ្ចូលទិន្នន័យអ្នកប្រើពេលមាន user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleKHQRPayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    // ពិនិត្យមើលព័ត៌មានចាំបាច់
    if (!formData.phone) {
      toast.error('Phone number is required');
      return;
    }
    if (!formData.address) {
      toast.error('Address is required');
      return;
    }
    if (!formData.city) {
      toast.error('City is required');
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = generateOrderId();
      
      // បង្កើត QR Code
      const response = await paymentApi.createPaymentQR({
        order_id: orderId,
        amount: totalPrice,
        currency: 'USD'
      });

      if (response.success) {
        setQrData(response);
        
        // ទាញយករូបភាព QR
        try {
          const imageUrl = await paymentApi.getQRImage(orderId);
          setQrImageUrl(imageUrl);
        } catch (error) {
          console.error('Failed to get QR image:', error);
        }
        
        toast.success('QR Code generated successfully');
        
        // ចាប់ផ្តើមពិនិត្យស្ថានភាពការទូទាត់រៀងរាល់ 5 វិនាទី
        const interval = setInterval(async () => {
          try {
            const status = await paymentApi.checkPaymentStatus(orderId);
            if (status.success && status.status === 'PAID') {
              clearInterval(interval);
              setPaymentStatus('PAID');
              
              // បង្កើត order បន្ទាប់ពីការទូទាត់ជោគជ័យ
              await createOrderAfterPayment();
              
              setIsSuccess(true);
              clearCart();
              toast.success('Payment successful!');
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }, 5000);
        
        setCheckInterval(interval);
      }
    } catch (error: any) {
      console.error('Failed to create QR:', error);
      toast.error(error.message || 'Failed to create payment QR');
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrderAfterPayment = async () => {
    try {
      // បង្កើត order items ពី cart
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      // បង្កើត shipping address
      const orderData = {
        payment_method: 'khqr',
        notes: `Phone: ${formData.phone}, Address: ${formData.address}, ${formData.city}`,
        items: orderItems
      };

      await orderApi.createOrder(orderData);
    } catch (error) {
      console.error('Failed to create order after payment:', error);
      // មិនបង្ហាញ error ដល់អ្នកប្រើទេ ព្រោះការទូទាត់បានជោគជ័យហើយ
    }
  };

  const handleCardPayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    // ពិនិត្យមើលព័ត៌មានចាំបាច់
    if (!formData.firstName || !formData.lastName) {
      toast.error('Full name is required');
      return;
    }
    if (!formData.phone) {
      toast.error('Phone number is required');
      return;
    }
    if (!formData.address) {
      toast.error('Address is required');
      return;
    }
    if (!formData.city) {
      toast.error('City is required');
      return;
    }
    if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
      toast.error('Payment information is required');
      return;
    }

    setIsProcessing(true);

    try {
      // បង្កើត order items ពី cart
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      // បង្កើត order
      const orderData = {
        payment_method: 'credit_card',
        notes: `Name: ${formData.firstName} ${formData.lastName}, Phone: ${formData.phone}, Address: ${formData.address}, ${formData.city}`,
        items: orderItems
      };

      await orderApi.createOrder(orderData);
      
      setIsSuccess(true);
      clearCart();
      toast.success('Order created successfully!');
    } catch (error: any) {
      console.error('Failed to create order:', error);
      toast.error(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'khqr') {
      await handleKHQRPayment();
    } else {
      await handleCardPayment();
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [checkInterval]);

  // បង្ហាញទំព័រជោគជ័យ
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-black mb-4">Order Confirmed!</h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed successfully. 
            A confirmation email has been sent to {formData.email || 'your email'}.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-black mb-3">Order Summary</h3>
            <p className="text-sm text-gray-600 mb-2">Total: ${totalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Payment Method: {paymentMethod === 'khqr' ? 'Bakong KHQR' : 'Credit Card'}</p>
          </div>
          
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // បង្ហាញពេល cart ទទេ
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/cart" 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Checkout Form */}
          <div>
            {/* Payment Method Selection */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-black mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-bold">Credit Card</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khqr')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'khqr'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <QrCode className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-bold">Bakong KHQR</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!!user}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="85512345678"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        required
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        required
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="Phnom Penh"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        required
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="12000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information - Card */}
              {paymentMethod === 'card' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        required
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          required
                          type="text"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          required
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KHQR Display */}
              {paymentMethod === 'khqr' && qrData && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                  <h3 className="text-xl font-bold text-black mb-6">Scan with Bakong App</h3>
                  
                  <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-lg">
                    {qrImageUrl ? (
                      <img 
                        src={qrImageUrl}
                        alt="KHQR Code"
                        className="w-64 h-64 mx-auto"
                        onError={(e) => {
                          console.error('Failed to load QR image');
                          e.currentTarget.src = 'https://via.placeholder.com/256?text=QR+Code';
                        }}
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-2xl font-bold text-black mb-4">
                    ${totalPrice.toFixed(2)}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-4 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Open Bakong App and scan the QR code
                  </p>
                  
                  {paymentStatus === 'PAID' ? (
                    <div className="bg-green-50 text-green-600 py-3 px-4 rounded-xl font-bold">
                      Payment Successful!
                    </div>
                  ) : (
                    <div className="bg-blue-50 text-blue-600 py-3 px-4 rounded-xl font-bold flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Waiting for payment...
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || (paymentMethod === 'khqr' && !!qrData && paymentStatus !== 'PAID')}
                className="w-full py-6 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : paymentMethod === 'khqr' && qrData ? (
                  paymentStatus === 'PAID' ? 'Payment Complete' : 'Waiting for Payment'
                ) : (
                  `Pay $${totalPrice.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-black mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-0">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image_url || 'https://via.placeholder.com/80'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-black mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-black">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold pt-4">
                  <span>Total</span>
                  <span className="text-2xl">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  <span>Secure payment guaranteed</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Free shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;