export const API_ENDPOINTS = {
  services: {
    topBooked: "/services/top-booked",
    categoryStats: "/services/category-stats",
    byCategorySlug: (slug: string) => `/services/category/slug/${slug}`,
    detailsBySlug: (slug: string) => `/services/details/${slug}`,
  },
};
