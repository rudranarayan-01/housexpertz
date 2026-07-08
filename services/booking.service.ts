import api from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
    CategoryServicesResponse,
    CategoryStat,
    ServiceDetailResponse,
    TopBookedService,
} from "@/types/service.types";

export const BookingService = {
  async getTopBooked(): Promise<TopBookedService[]> {
    const response = await api.get(API_ENDPOINTS.services.topBooked);
    return response.data;
  },

  async getCategoryStats(): Promise<CategoryStat[]> {
    const response = await api.get(API_ENDPOINTS.services.categoryStats);
    return response.data;
  },

  async getServicesByCategorySlug(
    categorySlug: string,
  ): Promise<CategoryServicesResponse> {
    const response = await api.get(
      API_ENDPOINTS.services.byCategorySlug(categorySlug),
    );
    return response.data;
  },

  async getServiceDetailsBySlug(slug: string): Promise<ServiceDetailResponse> {
    const response = await api.get(API_ENDPOINTS.services.detailsBySlug(slug));
    return response.data;
  },
};
