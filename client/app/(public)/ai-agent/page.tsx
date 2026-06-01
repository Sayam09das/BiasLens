import AIAgentHero from "../ai-agent/AIAgentHero";
import AgentCapabilitiesGrid from "../ai-agent/AgentCapabilitiesGrid";
import IntelligentResumeReview from "../ai-agent/IntelligentResumeReview";
import AIDecisionAssistant from "../ai-agent/AIDecisionAssistant";
import FairnessAgentSection from "../ai-agent/FairnessAgentSection";
import ResumeImprovementAgentSection from "../ai-agent/ResumeImprovementAgentSection";
import ReportAuditAgentSection from "../ai-agent/ReportAuditAgentSection";
import AgentWorkflowSection from "../ai-agent/AgentWorkflowSection";
import AIAgentComparisonSection from "../ai-agent/AIAgentComparisonSection";
import AgentMiniFAQ from "../ai-agent/AgentMiniFAQ";

export default function AIAgentPage() {
  return (
    <>
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
    </>
  );
}
