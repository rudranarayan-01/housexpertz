import api from "@/lib/api/client";

export interface OrderServiceItem {
  _id: string;
  service?: {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
  };
  quantity?: number;
  price?: number;
  variantTitle?: string;
}

export interface OrderHistoryItem {
  _id: string;
  orderId?: string;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  scheduledDate?: string;
  scheduledTime?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
  services?: OrderServiceItem[];
}

export interface OrderDetailResponse extends OrderHistoryItem {
  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  notes?: string;
  paymentMethod?: string;
}

export const orderService = {
  async fetchOrderHistory(): Promise<OrderHistoryItem[]> {
    const response = await api.get("/orders/history");
    return response.data;
  },

  async fetchOrderById(orderId: string): Promise<OrderDetailResponse> {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};
