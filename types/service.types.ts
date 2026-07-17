export interface TopBookedService {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  pricingType: string;
  image: string;
  rating: number;
  bookingCount?: number;
}

export interface CategoryStat {
  _id: string;
  count: number;
  name: string;
  slug: string;
  categoryImage: string;
  description: string;
}

export interface CategoryDetail {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface SubService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  pricingType: "fixed" | "hourly" | string;
  unitName: string;
  image: string;
  rating: number;
  seo?: Record<string, any>;
}

export interface CategoryServicesResponse {
  category: CategoryDetail;
  services: SubService[];
}

// @/types/service.types.ts

export interface ServiceCategory {
  _id: string;
  name: string;
  slug: string;
  [key: string]: any; // Allows any future fields
}

export interface ServiceVariant {
  _id: string;
  title: string;
  price: number;
  [key: string]: any;
}

export interface ServiceSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  [key: string]: any;
}

export interface ServiceDetailResponse {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price?: number;
  basePrice?: number;
  pricingType: "fixed" | "variant" | string;
  unitName?: string;
  rating?: number;
  duration?: string;
  category?: ServiceCategory;
  variants?: ServiceVariant[];
  seo?: ServiceSEO;
  createdAt?: string;
  updatedAt?: string;
  // Open index signature lets you access any future backend field
  // without modifying this type configuration again.
  [key: string]: any;
}

export interface BookOrderPayload {
  cartItems: {
    _id: string;
    name: string;
    price: number;
    image: string;
    variantTitle?: string | null;
  }[];
  totalAmount: number;
  userEmail: string;
  userName: string;
  address: string;
  phone: string;
  couponCode?: string | null;
  discountAmount?: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  orderId: string;
  dbId: string;
}
