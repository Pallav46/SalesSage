import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Helper function to get current time in milliseconds
const getCurrentTime = () => new Date().getTime();

// Helper function to calculate remaining time before token expiry
const getRemainingTime = (expiryTime) => expiryTime - getCurrentTime();

// Update the tokens and their expiry time
const updateTokens = (accessToken, refreshToken, expiresIn) => {
  const expiryTime = getCurrentTime() + (expiresIn * 1000); // expiresIn is in seconds
  Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' });
  Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'Strict' });
  Cookies.set('tokenExpiryTime', expiryTime, { secure: true, sameSite: 'Strict' });
};

// Check if token should be refreshed
const shouldRefreshToken = () => {
  const tokenExpiryTime = parseInt(Cookies.get('tokenExpiryTime'), 10);
  const remainingTime = getRemainingTime(tokenExpiryTime);
  const refreshThreshold = 0.1; // 10%
  return remainingTime <= (tokenExpiryTime - getCurrentTime()) * refreshThreshold;
};

// Add a request interceptor to include the access token in headers and refresh if needed
api.interceptors.request.use(
  async (config) => {
    if (shouldRefreshToken()) {
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post(
          'http://127.0.0.1:8000/accounts/refresh-token/',
          { refresh_token: refreshToken },
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('accessToken')}`
            }
          }
        );

        const { access_token: newAccessToken, refresh_token: newRefreshToken, access_token_exp: newExpiresIn } = response.data;
        updateTokens(newAccessToken, newRefreshToken, newExpiresIn);
      } catch (error) {
        console.error('Token refresh error', error);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('tokenExpiryTime');
        window.location.href = '/'; // Adjust according to your routing
      }
    }

    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Update tokens and expiry time if present in the response
    if (response.data.access_token && response.data.refresh_token) {
      const { access_token, refresh_token, access_token_exp } = response.data;
      updateTokens(access_token, refresh_token, access_token_exp);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!accessToken || !refreshToken) {
      // No tokens available
      window.location.href = '/'; // Adjust according to your routing
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          'http://127.0.0.1:8000/accounts/refresh-token/',
          { refresh_token: refreshToken },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        const { access_token: newAccessToken, refresh_token: newRefreshToken, access_token_exp: newExpiresIn } = response.data;

        // Update tokens and their expiry time
        updateTokens(newAccessToken, newRefreshToken, newExpiresIn);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh error', refreshError);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('tokenExpiryTime');
        window.location.href = '/'; // Adjust according to your routing
      }
    }

    return Promise.reject(error);
  }
);

export default api;