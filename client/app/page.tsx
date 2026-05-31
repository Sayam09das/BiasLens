import Footer from "@/components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Hero from "./(public)/home/hero";
import SocialProof from "./(public)/home/SocialProof";
import ProblemSection from "./(public)/home/ProblemSection";
import SolutionSection from "./(public)/home/SolutionSection";
import FeaturesGrid from "./(public)/Feature/FeaturesGrid";
import ProductShowcase from "./(public)/home/ProductShowcase";
import HowItWorks from "./(public)/home/HowItWorks";
import ExplainabilitySection from "./(public)/home/ExplainabilitySection";
import FairnessComplianceSection from "./(public)/home/FairnessComplianceSection";
import UseCases from "./(public)/home/UseCases";
import Pricing from "./(public)/home/Pricing";
import FAQ from "./(public)/home/FAQ";
import CTASection from "./(public)/home/CTASection";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <ProductShowcase />
      <HowItWorks />
      <ExplainabilitySection />
      <FairnessComplianceSection />
      <UseCases />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </>
  );
}

