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

export interface ServiceVariant {
  _id: string;
  title: string;
  price: number;
}

export interface ServiceDetailResponse {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  rating: number;
  duration?: string;
  basePrice: number;
  price: number;
  pricingType: "fixed" | "variant" | string;
  unitName?: string;
  variants?: ServiceVariant[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  numReviews: number;
}
