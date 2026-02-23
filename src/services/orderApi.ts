const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: string;
  payment_status: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
};

export const orderApi = {
  async createOrder(orderData: {
    payment_method: string;
    notes?: string;
    items: Array<{
      product_id: number;
      product_name: string;
      quantity: number;
      price: number;
    }>;
  }) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    return handleResponse(response);
  },

  async getUserOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  async getOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  async cancelOrder(id: number) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  }
};