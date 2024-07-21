import { useNavigate } from 'react-router-dom';
import DropdownMenu from '../components/dashboard/DropdownMenu';
import MyProfile from '../components/me/MyProfile';
import MyFiles from '../components/me/MyFiles';

const Me = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-color-300 via-color-400 to-color-500">
      <header className="bg-[#020024] text-white p-4 shadow-md flex items-center relative">
        <button 
          onClick={handleBackClick} 
          className="text-white hover:text-blue-300 font-bold focus:outline-none absolute left-4"
        >
          Back
        </button>
        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl font-bold">SalesSage</h1>
        </div>
        <div className="absolute right-4">
          <DropdownMenu />
        </div>
      </header>

      <main className="flex-grow container mx-auto my-8 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-stretch max-w-screen-xl">
        {/* MyProfile Section */}
        <div className="flex-1 md:mr-2 mb-4 md:mb-0">
          <div className="bg-[#020024] bg-opacity-50 rounded-3xl border border-white h-full overflow-hidden relative">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white text-center mb-4">My Profile</h2>
              <div className="overflow-y-auto max-h-[70vh] md:max-h-full">
                <MyProfile />
              </div>
            </div>
            <div className="absolute top-0 left-0 h-full border-l-8 border-sky-500 rounded-l-3xl -z-10"></div>
          </div>
        </div>

        {/* Separator Line (Visible on Medium and Larger Screens) */}
        <div className="w-1 bg-white mx-4 md:block hidden"></div>

        {/* MyFiles Section */}
        <div className="flex-1 md:ml-2">
          <div className="bg-[#020024] bg-opacity-50 rounded-3xl border border-white h-full overflow-hidden relative">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white text-center mb-4">My Files</h2>
              <div className="overflow-y-auto max-h-[70vh] md:max-h-full">
                <MyFiles />
              </div>
            </div>
            <div className="absolute top-0 right-0 h-full border-r-8 border-sky-500 rounded-r-3xl -z-10"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Me;
