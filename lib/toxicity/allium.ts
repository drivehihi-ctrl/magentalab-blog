import { ToxicityInput, ToxicityResult, ToxicSubstanceDefinition } from "./types";

export const allium: ToxicSubstanceDefinition = {
  id: "allium",
  evaluate: (input: ToxicityInput): ToxicityResult => {
    let detailsKey;
    
    if (input.substanceSubtype === "GARLIC_FRESH") {
      detailsKey = "ALLIUM_GARLIC_WARNING";
    } else if (input.substanceSubtype === "ALLIUM_POWDER" || input.substanceSubtype === "ALLIUM_DRY") {
      detailsKey = "ALLIUM_POWDER_WARNING";
    }

    return {
      decisionMode: "LIMITED_EVIDENCE",
      riskAssessment: "LIMITED_EVIDENCE",
      actionLevel: "PROMPT_VET_CONTACT",
      messageKey: "ALLIUM_LIMITED",
      detailsKey: detailsKey,
    };
  }
};
