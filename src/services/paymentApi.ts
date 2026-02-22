const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface PaymentQRRequest {
  order_id: string;
  amount: number;
  currency: string;
}

export interface PaymentQRResponse {
  success: boolean;
  qr_data?: string;
  md5?: string;
  deeplink?: string;
  bill_number?: string;
  order_id?: string;
  error?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status?: 'PAID' | 'UNPAID';
  payment_info?: any;
  error?: string;
}

// Helper function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const paymentApi = {
  async createPaymentQR(data: PaymentQRRequest): Promise<PaymentQRResponse> {
    const response = await fetch(`${API_BASE_URL}/payment/create-qr`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create payment QR');
    }

    return response.json();
  },

  async checkPaymentStatus(order_id: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/payment/check-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order_id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to check payment status');
    }

    return response.json();
  },

  async getQRImage(order_id: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/payment/qr-image/${order_id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get QR image');
    }
    
    const data = await response.json();
    return data.url;
  },
};