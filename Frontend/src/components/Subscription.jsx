import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const plans = [
  {
    type: "Free",
    price: "$0/month",
    features: ["Basic access", "Limited storage", "Email support"],
    tier: 1
  },
  {
    type: "Pro",
    price: "$15/month",
    features: ["Full access", "Unlimited storage", "Priority support", "Advanced analytics"],
    tier: 2
  },
  {
    type: "Enterprise",
    price: "Custom",
    features: ["All Pro features", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
    tier: 3
  }
];

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
          const response = await axios.get("http://localhost:8000/accounts/me/", {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const fetchedUserData = response.data;
          setUserData(fetchedUserData);
          setCurrentPlan(parseInt(fetchedUserData.tier, 10));
        } else {
          setUserData(null); // Ensure userData is null if no token
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, possibly show a message to the user
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async (tier) => {
    if (tier === 1) {
      console.log("Free plan selected. No payment required.");
      return;
    }

    try {
      const accessToken = Cookies.get('accessToken');

      if (!accessToken) {
        console.error("No access token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/subscription/purchase/",
        { tier },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const data = response.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SalesSage",
        description: `Tier ${tier}`,
        image: "https://example.com/your_logo",
        order_id: data.order_id,
        callback_url: "http://localhost:8000/subscription/callback/",
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error fetching order_id:', error);
    }
  };

  const getButtonText = (tier) => {
    if (!userData) return 'Buy Now';

    if (currentPlan === null) return 'Loading...';

    if (tier > currentPlan) return 'Upgrade';
    if (tier < currentPlan) return 'Downgrade';
    return 'Current Plan';
  };

  return (
    <div className="bg-gradient-to-r from-color-300 via-color-400 to-color-500 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8 md:mb-12">
          <h1 className="text-white text-3xl md:text-5xl font-bold mx-auto">Subscription Plans</h1>
        </div>
        
       
        
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group w-full md:w-1/3 bg-gradient-to-b from-gray-800/20 to-transparent rounded-3xl p-0.5 relative overflow-hidden shadow-md hover:shadow-xl transition duration-300 ${
                index === 0 ? 'border-t-8 border-r-4 border-b-2 border-opacity-80 border-white' :
                index === 1 ? 'border-l-8 border-r-4 border-b-2 border-opacity-80 border-white' :
                index === 2 ? 'border-l-2 border-t-4 border-b-8 border-opacity-80 border-white' : ''
              }`}
            >
              <div className="bg-gradient-to-b from-gray-900/50 to-transparent h-full rounded-3xl flex flex-col justify-between group-hover:border-opacity-100 group-hover:border-white">
                {index === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
                )}
                <div className="p-8 relative z-10 text-white text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-400 transition duration-300">{plan.type}</h2>
                  <p className="text-xl md:text-2xl mb-6">{plan.price}</p>
                  <ul className="space-y-2 text-left mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 bg-color-300 hover:bg-white hover:text-color-300 text-white font-bold py-2 px-4 rounded-full transition duration-300 group-hover:scale-105 ${
                      !userData ? 'bg-blue-500 hover:bg-blue-600' : (currentPlan === plan.tier ? 'bg-green-500 hover:bg-green-600' : '')
                    }`}
                    onClick={() => handlePayment(plan.tier)}
                    disabled={!userData || currentPlan === plan.tier}
                  >
                    {getButtonText(plan.tier)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
