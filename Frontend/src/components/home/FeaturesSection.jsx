import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white bg-opacity-10 p-6 rounded-lg transform hover:scale-105 transition duration-300">
    {icon}
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <svg className="w-12 h-12 mb-4 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
      title: "Future Predictions",
      description: "Leverage AI to forecast your sales trends and make data-driven decisions."
    },
    {
      icon: <svg className="w-12 h-12 mb-4 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
      title: "Comprehensive Reports",
      description: "Generate detailed sales reports with actionable insights at your fingertips."
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;