import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeaturesHero from "../(public)/Feature/FeaturesHero";
import FeatureOverviewGrid from "../(public)/Feature/FeatureOverviewGrid";
import ResumeIntelligenceSection from "../(public)/home/ResumeIntelligenceSection";
import ExplainabilityDeepDive from "../(public)/Feature/ExplainabilityDeepDive";
import AuditReportingSection from "../(public)/Feature/AuditReportingSection";
import SecurityWorkflowSection from "../(public)/Feature/SecurityWorkflowSection";
import IntegrationsPreviewSection from "../(public)/Feature/IntegrationsPreviewSection";
import FeatureComparisonSection from "../(public)/Feature/FeatureComparisonSection";
import FeaturesMiniFAQ from "../(public)/Feature/FeaturesMiniFAQ";
import FeaturesCTA from "../(public)/Feature/FeaturesCTA";

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
        <SecurityWorkflowSection />
        <IntegrationsPreviewSection />
        <FeatureComparisonSection />
        <FeaturesMiniFAQ />
        <FeaturesCTA />
      </main>
      <Footer />
    </>
  );
}


