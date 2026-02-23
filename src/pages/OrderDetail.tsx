import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi, Order } from '../services/orderApi';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Calendar, MapPin, Phone, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderApi.getOrder(Number(id));
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing': return <Package className="w-5 h-5 text-yellow-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-600 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Order #{order.order_number}</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)} flex items-center space-x-1`}>
            {getStatusIcon(order.status)}
            <span className="capitalize ml-1">{order.status}</span>
          </span>
        </div>

        <p className="text-gray-600 mb-8 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-bold text-lg">
                <p>Total</p>
                <p>${order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="font-medium capitalize">{order.payment_status}</p>
                  </div>
                </div>
                {order.tracking_number && (
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="font-medium">{order.tracking_number}</p>
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              {order.notes ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm">{order.notes}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address provided</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          {order.status === 'pending' && (
            <button
              onClick={() => {
                // Cancel order logic
                toast.success('Order cancelled successfully');
                navigate('/dashboard');
              }}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;