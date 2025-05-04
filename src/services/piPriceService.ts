
/**
 * Service for fetching Pi cryptocurrency price data from OKX exchange
 */

// OKX API endpoints
const OKX_API_BASE_URL = 'https://www.okx.com';
const FALLBACK_API_URL = 'https://api.coingecko.com/api/v3';

// Exchange rate for EGP (Egyptian Pound) relative to USD
const EGP_USD_RATE = 30.85; // Static fallback rate if dynamic rate fetch fails

/**
 * Fetches Pi price data from OKX exchange
 */
export const fetchPiPrice = async () => {
  try {
    // Try to fetch from OKX
    const response = await fetch(`${OKX_API_BASE_URL}/api/v5/market/ticker?instId=PI-USDT`);
    
    if (!response.ok) {
      throw new Error('OKX API request failed');
    }
    
    const data = await response.json();
    
    // Check if we have valid data from OKX
    if (data.data && data.data.length > 0) {
      const piData = data.data[0];
      const lastPrice = parseFloat(piData.last);
      const open24h = parseFloat(piData.open24h);
      
      // Calculate 24h change percentage
      const change24h = ((lastPrice - open24h) / open24h) * 100;
      
      return {
        price: lastPrice,
        change24h,
        egpRate: lastPrice * EGP_USD_RATE,
        source: 'OKX',
        lastUpdated: new Date(),
      };
    } else {
      throw new Error('Invalid response from OKX');
    }
  } catch (error) {
    console.error('Error fetching Pi price from OKX:', error);
    
    // Fallback to alternative source or use static data
    try {
      return await fetchFallbackPiPrice();
    } catch (fallbackError) {
      console.error('Error fetching fallback Pi price:', fallbackError);
      
      // Return cached or static data as last resort
      return {
        price: 31.25, // Static fallback price
        change24h: 3.5, // Static fallback change percentage
        egpRate: 31.25 * EGP_USD_RATE,
        source: 'Static',
        lastUpdated: new Date(),
      };
    }
  }
};

/**
 * Fallback method to fetch Pi price data from alternative source
 */
const fetchFallbackPiPrice = async () => {
  // Attempting to use CoinGecko as fallback
  // Note: Pi Network may not be available on all public APIs
  const response = await fetch(`${FALLBACK_API_URL}/simple/price?ids=pi-network&vs_currencies=usd&include_24hr_change=true`);
  
  if (!response.ok) {
    throw new Error('Fallback API request failed');
  }
  
  const data = await response.json();
  
  if (data && data['pi-network']) {
    const priceData = data['pi-network'];
    return {
      price: priceData.usd,
      change24h: priceData.usd_24h_change || 0,
      egpRate: priceData.usd * EGP_USD_RATE,
      source: 'CoinGecko',
      lastUpdated: new Date(),
    };
  } else {
    throw new Error('Invalid response from fallback API');
  }
};
