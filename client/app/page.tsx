import Footer from "@/components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Hero from "./(public)/home/hero";
import SocialProof from "./(public)/home/SocialProof";
import ProblemSection from "./(public)/home/ProblemSection";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <ProblemSection />
      <Footer />
    </>
  );
}

