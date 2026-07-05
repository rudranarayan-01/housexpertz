import api from '@/utils/api';

export interface Offer {
    _id: string;
    code: string;
    description: string;
    discountType: 'flat' | 'percentage' | string;
    discountValue: number;
    minOrderAmount: number;
    maxDiscount?: number;
    expiryDate: string;
    isActive: boolean;
}

export interface OffersResponse {
    success: boolean;
    offers: Offer[];
}

export const OffersService = {
    getAvailableOffers: async (): Promise<OffersResponse> => {
        const response = await api.get('/offers/available');
        return response.data;
    },
};