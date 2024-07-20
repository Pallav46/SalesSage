import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
          const response = await axios.get("http://localhost:8000/accounts/me/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const fetchedUserData = response.data;
          setUser(fetchedUserData); // Fixed typo here
        } else {
          setError('No access token found');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 text-white p-8">
      <header className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)} // Use navigate for going back
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back
          </button>
          <h1 className="text-4xl font-bold text-center">SalesSage</h1>
        </div>
      </header>
      <div className="bg-blue-300 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user ? user.company_id.charAt(0) : 'A'} {/* Display company initials or placeholder */}
          </div>
          <h1 className="text-3xl font-bold mb-2">{user ? user.company_name : 'Loading...'}</h1>
          <p className="text-lg mb-4">{user ? user.email : 'Loading...'}</p>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-400 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Company Details</h2>
            <p>Company ID: {user ? user.company_id : 'Loading...'}</p>
            <p>Company Name: {user ? user.company_name : 'Loading...'}</p>
          </div>
          <div className="bg-blue-400 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Subscription Details</h2>
            <p>Current Tier: {user ? `Tier ${user.tier}` : 'Loading...'}</p>
            <p>Expiry Date: {user ? new Date(user.expiry_date).toLocaleDateString() : 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
