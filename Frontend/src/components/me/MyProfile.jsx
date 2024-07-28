import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        const response = await axios.get("http://localhost:8000/accounts/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);
      } else {
        setError('No access token found');
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.detail || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditProfile = useCallback(() => {
    navigate('/edit-profile'); // Adjust the path as needed
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[62vh] bg-opacity-40 p-8 rounded-lg shadow-lg">
      {loading ? (
        <div className="text-center text-white min-w-[300px] min-h-[200px] flex items-center justify-center rounded-lg">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 min-w-[300px] min-h-[200px] flex items-center justify-center rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="max-w-md w-full flex flex-col flex-grow">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-[#00BFFF] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.company_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#00BFFF] mb-2">{user?.company_name}</h3>
              <p className="text-white">{user?.email}</p>
            </div>
          </div>
          
          <div className="border-t border-sky-500 pt-4">
            <h4 className="text-lg font-semibold mb-2 text-sky-500">Company Details</h4>
            <p className="text-sky-400">
              <span className="font-medium text-sky-500">ID:</span> <span className="text-white">{user?.company_id}</span>
            </p>
            <p className="text-sky-400">
              <span className="font-medium text-sky-500">Name:</span> <span className="text-white">{user?.company_name}</span>
            </p>
          </div>
          
          <div className="border-t border-sky-500 pt-4 mb-6">
            <h4 className="text-lg font-semibold mb-2 text-sky-500">Subscription</h4>
            <p className="text-sky-400">
              <span className="font-medium text-sky-500">Tier:</span> <span className="text-white">{user ? `Tier ${user.tier}` : 'N/A'}</span>
            </p>
            <p className="text-sky-400">
              <span className="font-medium text-sky-500">Expiry:</span> <span className="text-white">{user.tier != 1 ? new Date(user.expiry_date).toLocaleDateString() : 'N/A'}</span>
            </p>
          </div>

          <div className="flex justify-center mt-auto">
            <button 
              onClick={handleEditProfile} 
              className="bg-[#00BFFF] text-white py-2 px-4 rounded hover:bg-[#1e90ff] transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
