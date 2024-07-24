import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast
import Cookies from "js-cookie";
import { useAuthContext } from '../../context/AuthContext';


const DropdownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const {setAuthUser} = useAuthContext()

  const handleMouseLeave = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate('/me'); // Navigate to /me
  };

  const handleMyPlanClick = () => {
    
  };

  const handleLogoutClick = async () => {
    try {
      // Make the API call to log out
      await axios.post('http://127.0.0.1:8000/accounts/logout/', {}, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('accessToken')}` // Use Cookies to get the token
        }
      });
      
      // Clear cookies or local storage as needed
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem("user");
			setAuthUser(null);
      // Navigate to home page
      navigate('/');
      
      // Show success toast notification
      toast.success('Logout successfully!');
    } catch (error) {
      console.error('Logout error', error);
      toast.error('An error occurred during logout. Please try again.');
    }
  };

  return (
    <div
      className="relative ml-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FaUserCircle className="text-2xl cursor-pointer w-24" onClick={handleDropdownClick} />
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-24 text-white rounded-lg shadow-lg z-10"
          style={{ backgroundColor: 'rgba(2, 0, 36, 0.8)' }}
        >
          <ul className="py-2">
            <li
              className="px-4 py-2 hover:bg-gray-600 cursor-pointer rounded-t-lg"
              onClick={handleProfileClick}
            >
              Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
              onClick={handleLogoutClick}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
