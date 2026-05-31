import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeaturesHero from "../(public)/Feature/FeaturesHero";
import FeatureOverviewGrid from "../(public)/Feature/FeatureOverviewGrid";
import ResumeIntelligenceSection from "../(public)/Feature/ResumeIntelligenceSection";
import ExplainabilityDeepDive from "../(public)/Feature/ExplainabilityDeepDive";
import AuditReportingSection from "../(public)/Feature/AuditReportingSection";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        <FeaturesHero />
        <FeatureOverviewGrid />
        <ResumeIntelligenceSection />
        <ExplainabilityDeepDive />
        <AuditReportingSection />
      </main>
      <Footer />
    </>
  );
}


