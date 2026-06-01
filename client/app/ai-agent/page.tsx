import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AIAgentHero from "../(public)/ai-agent/AIAgentHero";
import AgentCapabilitiesGrid from "../(public)/ai-agent/AgentCapabilitiesGrid";
import IntelligentResumeReview from "../(public)/ai-agent/IntelligentResumeReview";
import AIDecisionAssistant from "../(public)/ai-agent/AIDecisionAssistant";
import FairnessAgentSection from "../(public)/ai-agent/FairnessAgentSection";
import ResumeImprovementAgentSection from "../(public)/ai-agent/ResumeImprovementAgentSection";
import ReportAuditAgentSection from "../(public)/ai-agent/ReportAuditAgentSection";
import AgentWorkflowSection from "../(public)/ai-agent/AgentWorkflowSection";
import AIAgentComparisonSection from "../(public)/ai-agent/AIAgentComparisonSection";
import AgentMiniFAQ from "../(public)/ai-agent/AgentMiniFAQ";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        <AIAgentHero />
        <AgentCapabilitiesGrid />
        <IntelligentResumeReview />
        <AIDecisionAssistant />
        <FairnessAgentSection />
        <ResumeImprovementAgentSection />
        <ReportAuditAgentSection />
        <AgentWorkflowSection />
        <AIAgentComparisonSection />
        <AgentMiniFAQ />
      </main>
      <Footer />
    </>
  );
}


