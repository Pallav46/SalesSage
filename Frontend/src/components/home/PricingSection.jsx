import React from 'react';

const PricingCard = ({ title, price, features, isPopular }) => (
  <div className={`bg-white bg-opacity-10 p-8 rounded-lg ${isPopular ? 'border-4 border-[#00D4FF]' : ''}`}>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-6">${price}<span className="text-xl font-normal">/mo</span></p>
    <ul className="mb-8">
      {features.map((feature, index) => (
        <li key={index} className="mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className="w-full bg-[#00D4FF] text-[#090979] py-2 rounded-full font-semibold hover:bg-blue-400 transition duration-300">
      Choose Plan
    </button>
  </div>
);

const PricingSection = () => {
  const plans = [
    {
      title: "Basic",
      price: 0,
      features: ["Limited predictions", "Basic chat support", "1 user"],
      isPopular: false
    },
    {
      title: "Pro",
      price: 49,
      features: ["Unlimited predictions", "Advanced chat support", "5 users", "API access"],
      isPopular: true
    },
    {
      title: "Enterprise",
      price: 99,
      features: ["Custom predictions", "24/7 premium support", "Unlimited users", "Custom integrations"],
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;