import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';
import OurTeam from '../components/OurTeam';
import Subscription from '../components/Subscription';
import AboutSection from '../components/home/AboutSection';
import FeaturesSection from '../components/home/FeaturesSection';
import ShowcaseSection from '../components/home/ShowcaseSection';
import ContactUsSection from '../components/home/ContactUsSection';
// import Footer from '../components/home/Footer';
import TeamSection from '../components/home/TeamSection';
import HeaderSection from '../components/home/HeaderSection';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import PricingSection from '../components/home/PricingSection';
import Testimonials from '../components/home/Testimonials';
import Team from '../components/home/Team';

const LandingPage = () => {
  return (
    <div className="font-sans text-white bg-gradient-to-br from-[#020024] via-[#090979] to-[#00D4FF] min-h-screen">
      {/* <HeaderSection /> */}
      <main>
        <Hero />
        <HowItWorks />
        <Subscription/>
        <FeaturesSection />
        {/* <Testimonials /> */}
        <Team />
        <ContactUsSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
