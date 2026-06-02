import HomeRedirectGate from "@/components/auth/HomeRedirectGate";
import Hero from "./home/hero";
import SocialProof from "./home/SocialProof";
import ProblemSection from "./home/ProblemSection";
import SolutionSection from "./home/SolutionSection";
import FeaturesGrid from "./Feature/FeaturesGrid";
import ProductShowcase from "./home/ProductShowcase";
import HowItWorks from "./home/HowItWorks";
import ExplainabilitySection from "./home/ExplainabilitySection";
import FairnessComplianceSection from "./home/FairnessComplianceSection";
import UseCases from "./home/UseCases";
import Pricing from "./home/Pricing";
import FAQ from "./home/FAQ";
import CTASection from "./home/CTASection";

export default function HomePage() {
  return (
    <>
      <HomeRedirectGate />
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
    </>
  );
}
