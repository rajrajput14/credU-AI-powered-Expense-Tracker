// Polar Client Configuration
// Note: Management and Checkout creation are handled via Supabase Edge Functions
// for security (holding the API Key).

export const POLAR_CONFIG = {
    priceId: import.meta.env.VITE_POLAR_PRICE_ID
};
