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
  user_id: number;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
  shipping_address?: any;
}

// Helper function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to handle response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
};

export const orderApi = {
  // ទាញយក orders របស់អ្នកប្រើបច្ចុប្បន្ន
  async getUserOrders(skip: number = 0, limit: number = 20): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // ទាញយក order តាម ID
  async getOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // ទាញយក order តាមលេខ order
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/number/${orderNumber}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // បង្កើត order ថ្មី
  async createOrder(orderData: any): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    return handleResponse(response);
  },

  // បោះបង់ order
  async cancelOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};