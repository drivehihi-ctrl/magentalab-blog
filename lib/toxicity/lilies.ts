import { ToxicityInput, ToxicityResult, ToxicSubstanceDefinition } from "./types";

export const lilies: ToxicSubstanceDefinition = {
  id: "lilies",
  evaluate: (input: ToxicityInput): ToxicityResult => {
    // Lilies are primarily a cat toxicity issue.
    if (input.species === "dog") {
      return {
        decisionMode: "LIMITED_EVIDENCE",
        riskAssessment: "LIMITED_EVIDENCE",
        actionLevel: "CONTACT_VET",
        messageKey: "LILY_UNKNOWN", // fallback
      };
    }

    if (input.substanceSubtype === "TRUE_LILY_LILIUM" || input.substanceSubtype === "DAYLILY_HEMEROCALLIS") {
      return {
        decisionMode: "NON_CALCULABLE",
        riskAssessment: "NON_QUANTIFIABLE",
        actionLevel: "EMERGENCY_VET_CONTACT",
        messageKey: "LILY_TRUE_DAYLILY",
      };
    } else if (input.substanceSubtype === "PEACE_LILY" || input.substanceSubtype === "CALLA_LILY") {
      return {
        decisionMode: "NON_CALCULABLE",
        riskAssessment: "LIMITED_EVIDENCE",
        actionLevel: "PROMPT_VET_CONTACT",
        messageKey: "LILY_PEACE_CALLA",
      };
    } else {
      return {
        decisionMode: "NON_CALCULABLE",
        riskAssessment: "NON_QUANTIFIABLE",
        actionLevel: "PROMPT_VET_CONTACT",
        messageKey: "LILY_UNKNOWN",
      };
    }
  }
};
