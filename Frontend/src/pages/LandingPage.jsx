import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';
import OurTeam from '../components/OurTeam';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <section id="about">
          <About />
        </section>
        <OurTeam/>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
