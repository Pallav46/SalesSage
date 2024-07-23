import React from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-pulse">
          Revolutionize Your Sales with AI
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          SalesSage: Your AI-powered crystal ball for sales predictions and real-time insights.
        </p>
        <a href="#" className="bg-white text-[#090979] px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 transform hover:scale-105 inline-block">
          Start Free Trial
        </a>
      </div>
    </section>
  );
};

export default HeroSection;