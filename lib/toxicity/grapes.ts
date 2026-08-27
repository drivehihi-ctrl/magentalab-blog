import { ToxicityInput, ToxicityResult, ToxicSubstanceDefinition } from "./types";

export const grapes: ToxicSubstanceDefinition = {
  id: "grapes",
  evaluate: (input: ToxicityInput): ToxicityResult => {
    // 1. Cats: Limited Evidence
    if (input.species === "cat") {
      return {
        decisionMode: "LIMITED_EVIDENCE",
        riskAssessment: "LIMITED_EVIDENCE",
        actionLevel: "CONTACT_VET",
        messageKey: "GRAPE_CAT_LIMITED",
      };
    }

    // 2. Dogs
    // Grape ingestion amount is not calculable for safety. Any amount is NON_QUANTIFIABLE risk.
    // If the user says they ingested 0g, it means they didn't ingest it.
    // But if isAmountUnknown is true, they ingested an unknown amount.
    if (input.ingestionAmountGram === 0 && !input.isAmountUnknown) {
      return {
        decisionMode: "NON_CALCULABLE",
        riskAssessment: "LOW_ESTIMATED_RISK",
        actionLevel: "OBSERVE_AND_VERIFY",
        messageKey: "GRAPE_DOG_PROMPT", // we can use the same prompt, or maybe a SAFE prompt, but for now we rely on the UI to not trigger if 0.
      };
    }

    return {
      decisionMode: "NON_CALCULABLE",
      riskAssessment: "NON_QUANTIFIABLE",
      actionLevel: "PROMPT_VET_CONTACT",
      messageKey: "GRAPE_DOG_PROMPT",
    };
  }
};
