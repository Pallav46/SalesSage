import axios from 'axios';
import Cookies from 'js-cookie';

let refreshInterval;
const REFRESH_INTERVAL = 1 * 1000 * 60 * 60 * 2.9; // 30 seconds in milliseconds

export const startTokenRefresh = () => {
  stopTokenRefresh();
  refreshToken();
  refreshInterval = setInterval(refreshToken, REFRESH_INTERVAL);
};

const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    const accessToken = Cookies.get('accessToken');
    if (!refreshToken || !accessToken) {
      console.error('No refresh token or access token found');
      handleTokenExpiration();
      return;
    }

    const response = await axios.post(
      "http://localhost:8000/accounts/refresh-token/",
      { "refresh_token": refreshToken },
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data) {
      const { access_token: newAccessToken } = response.data;
      if (newAccessToken) {
        Cookies.set('accessToken', newAccessToken, { secure: true, sameSite: 'Strict' });
        Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'Strict' });
        console.log('Access token refreshed successfully');
      } else {
        console.error('Invalid response data structure');
        handleTokenExpiration();
      }
    } else {
      console.error('Unexpected response status or data');
      handleTokenExpiration();
    }
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
    handleTokenExpiration();
  }
};

export const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

const handleTokenExpiration = () => {
  stopTokenRefresh();
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

// Add this function to check for token expiration on API calls
export const handleApiError = (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    handleTokenExpiration();
  }
  throw error;
};