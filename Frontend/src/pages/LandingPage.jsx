import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';
import OurTeam from '../components/OurTeam';
import Subscription from '../components/Subscription';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <Subscription/>
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
