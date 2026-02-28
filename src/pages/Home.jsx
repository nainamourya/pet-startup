import AboutUs from "../components/layout/AboutUs";
import CredibilityStats from "../components/layout/CredibilityStats";

import Hero from "../components/layout/home/Hero";
import StoryTimeline from "../components/layout/StoryTimeline";
import Testimonials from "../components/layout/Testimonials";
import { Helmet } from "react-helmet-async";
export default function Home() {
  
  return (
  <>
    <Helmet>
    <title>Petroo – Book Trusted Pet Sitters & Cat Boarding in Mumbai</title>
    <meta
      name="description"
      content="Looking for trusted pet sitters in Mumbai? Petroo connects pet parents with verified cat boarding, pet daycare, and home pet sitting services. Safe, secure and stress-free booking."
    />
  </Helmet>
    <div className="min-h-screen">
      <Hero />
      <AboutUs />
      <StoryTimeline />
      <CredibilityStats />
      <Testimonials />
    </div>
  
  </>
  );
}
