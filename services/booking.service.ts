import api from '@/utils/api';

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
    pricingType: 'fixed' | 'hourly' | string; // maps to your backend models
    unitName: string;                         // e.g., "per appliance", "per visit"
    image: string;
    rating: number;
    seo?: Record<string, any>;
}

// The direct JSON output signature returned by this specific controller
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
    pricingType: 'fixed' | 'variant' | string;
    unitName?: string;
    variants?: ServiceVariant[];
    category: {
        _id: string;
        name: string;
        slug: string;
    };
    numReviews: number;
}

// Extend your BookingService object
export const BookingService = {

    getTopBooked: async (): Promise<TopBookedService[]> => {
        const response = await api.get('/api/v1/services/top-booked');
        return response.data;
    },

    getCategoryStats: async (): Promise<CategoryStat[]> => {
        const response = await api.get('/api/v1/services/category-stats');
        return response.data;
    },

    getServicesByCategorySlug: async (categorySlug: string): Promise<CategoryServicesResponse> => {
        const response = await api.get(`/api/v1/services/category/slug/${categorySlug}`);
        return response.data;
    },

    getServiceDetailsBySlug: async (slug: string): Promise<ServiceDetailResponse> => {
        const response = await api.get(`/api/v1/services/detail/${slug}`);
        return response.data;
    },
};