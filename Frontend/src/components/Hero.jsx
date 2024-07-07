import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="bg-hero-pattern bg-cover bg-center h-screen flex items-center justify-center text-center text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Professional Website</h1>
        <p className="text-lg md:text-xl mb-8">We offer top-notch services to help you achieve your goals.</p>
        <a href="#about" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Learn More About Us
        </a>
      </div>
    </section>
  );
};

export default Hero;
