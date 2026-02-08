import AboutUs from "../components/layout/AboutUs";
import CredibilityStats from "../components/layout/CredibilityStats";
import Footer from "../components/layout/Footer";
import Hero from "../components/layout/home/Hero";
import StoryTimeline from "../components/layout/StoryTimeline";
import Testimonials from "../components/layout/Testimonials";
export default function Home() {
  return (
    <div className="min-h-screen">
   <Hero/>
   <AboutUs/>
   <StoryTimeline/>
   <CredibilityStats/>
   <Testimonials/>
  <Footer/>
   
    </div>
  );
}
