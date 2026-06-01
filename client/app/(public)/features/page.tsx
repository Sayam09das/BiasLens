import FeaturesHero from "../Feature/FeaturesHero";
import FeatureOverviewGrid from "../Feature/FeatureOverviewGrid";
import ResumeIntelligenceSection from "../home/ResumeIntelligenceSection";
import ExplainabilityDeepDive from "../Feature/ExplainabilityDeepDive";
import AuditReportingSection from "../Feature/AuditReportingSection";
import SecurityWorkflowSection from "../Feature/SecurityWorkflowSection";
import IntegrationsPreviewSection from "../Feature/IntegrationsPreviewSection";
import FeatureComparisonSection from "../Feature/FeatureComparisonSection";
import FeaturesMiniFAQ from "../Feature/FeaturesMiniFAQ";
import FeaturesCTA from "../Feature/FeaturesCTA";

export default function FeaturesPage() {
  return (
    <>
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
    </>
  );
}
