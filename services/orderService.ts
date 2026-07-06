const BASE_URL = 'https://api.housexpertz.in/api/v1';

export const orderService = {
    fetchOrderHistory: async (getAuthToken: () => Promise<string | null>) => {
        // Retrieve the current active session JWT from Clerk
        const token = await getAuthToken();

        if (!token) {
            throw new Error('Authentication token is missing. Please log in.');
        }

        const response = await fetch(`${BASE_URL}/orders/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Pass the token inside the Bearer scheme expected by your fastAuth middleware
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Network error syncing service records');
        }

        return response.json();
    },

    fetchOrderById: async (orderId: string, getToken: () => Promise<string | null>) => {
        try {
            const token = await getToken();
            if (!token) throw new Error('Authentication token missing');

            const response = await fetch(`https://api.housexpertz.in/api/v1/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Assumes standard Bearer token validation matching requireAuth()
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error in fetchOrderById for ID ${orderId}:`, error);
            throw error;
        }
    }
};