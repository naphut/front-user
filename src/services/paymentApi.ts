const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface PaymentQRRequest {
  order_id: string;
  amount: number;
  currency?: string;
}

export interface PaymentQRResponse {
  success: boolean;
  qr_string?: string;
  qr_image?: string;
  md5?: string;
  amount?: number;
  currency?: string;
  error?: string;
  merchant_id?: string;
  phone_number?: string;
  is_mock?: boolean;
}

export interface PaymentStatusResponse {
  md5: string;
  status: string;
  success?: boolean;
  transaction_id?: string;
  is_mock?: boolean;
}

export const paymentApi = {
  // បង្កើត QR Code សម្រាប់ការទូទាត់
  async createPaymentQR(data: PaymentQRRequest): Promise<PaymentQRResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Please login to continue');
    }

    try {
      console.log('📤 Sending payment request:', data);
      
      const response = await fetch(`${API_BASE_URL}/payment/create-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: data.order_id,
          amount: data.amount,
          currency: data.currency || 'USD'
        }),
      });

      const responseData = await response.json();
      console.log('📥 Payment response:', responseData);

      if (!response.ok) {
        console.error('Payment QR creation failed:', responseData);
        throw new Error(responseData.detail || 'Failed to create payment QR');
      }

      return responseData;
    } catch (error) {
      console.error('Error in createPaymentQR:', error);
      throw error;
    }
  },

  // ពិនិត្យស្ថានភាពការទូទាត់
  async checkPaymentStatus(md5: string): Promise<PaymentStatusResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Please login to continue');
    }

    try {
      console.log('🔍 Checking payment status for MD5:', md5);
      
      const response = await fetch(`${API_BASE_URL}/payment/check-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ md5 }),
      });

      const responseData = await response.json();
      console.log('📥 Payment status response:', responseData);

      if (!response.ok) {
        console.error('Payment status check failed:', responseData);
        throw new Error(responseData.detail || 'Failed to check payment status');
      }

      return responseData;
    } catch (error) {
      console.error('Error in checkPaymentStatus:', error);
      throw error;
    }
  },

  // បង្កើត QR Code Image URL ពី QR string
  generateQRImageUrl(qrString: string): string {
    return `https://chart.googleapis.com/chart?chs=256x256&cht=qr&chl=${encodeURIComponent(qrString)}`;
  },

  // ពិនិត្យស្ថានភាព service
  async getServiceStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/status`);
      return response.json();
    } catch (error) {
      console.error('Error checking payment service status:', error);
      return { configured: false, service: 'unavailable' };
    }
  }
};