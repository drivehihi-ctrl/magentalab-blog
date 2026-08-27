import { ToxicityInput, ToxicityResult, ToxicSubstanceDefinition } from "./types";

const CHOCOLATE_METHYLXANTHINE_MG_PER_G: Record<string, number> = {
  MILK_CHOCOLATE: 2.3,
  DARK_SEMISWEET_CHOCOLATE: 5.5,
  BAKERS_UNSWEETENED_CHOCOLATE: 15.5,
  COCOA_POWDER: 28.5,
};

export const chocolate: ToxicSubstanceDefinition = {
  id: "chocolate",
  evaluate: (input: ToxicityInput): ToxicityResult => {
    // 1. Cats: Limited Evidence
    if (input.species === "cat") {
      return {
        decisionMode: "LIMITED_EVIDENCE",
        riskAssessment: "LIMITED_EVIDENCE",
        actionLevel: "CONTACT_VET",
        messageKey: "CHOCOLATE_CAT_LIMITED",
      };
    }

    // 2. Dogs
    if (input.substanceSubtype === "UNKNOWN_CHOCOLATE") {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "NON_QUANTIFIABLE",
        actionLevel: "PROMPT_VET_CONTACT",
        ingredientKnown: false,
        messageKey: "CHOCOLATE_UNKNOWN",
      };
    }

    const mgPerGram = CHOCOLATE_METHYLXANTHINE_MG_PER_G[input.substanceSubtype || "MILK_CHOCOLATE"] || 2.3;
    const amount = input.ingestionAmountGram || 0;
    const mgPerKg = (amount * mgPerGram) / input.weightKg;

    if (mgPerKg < 20) {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "LOW_ESTIMATED_RISK",
        actionLevel: "OBSERVE_AND_VERIFY",
        calculatedDose: mgPerKg,
        doseUnit: "mg/kg",
        ingredientKnown: true,
        messageKey: "CHOCOLATE_LOW",
      };
    } else if (mgPerKg < 40) {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "CLINICAL_SIGNS_POSSIBLE",
        actionLevel: "CONTACT_VET",
        calculatedDose: mgPerKg,
        doseUnit: "mg/kg",
        ingredientKnown: true,
        messageKey: "CHOCOLATE_CLINICAL",
      };
    } else if (mgPerKg < 60) {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "HIGH_RISK",
        actionLevel: "PROMPT_VET_CONTACT",
        calculatedDose: mgPerKg,
        doseUnit: "mg/kg",
        ingredientKnown: true,
        messageKey: "CHOCOLATE_HIGH_CARDIO",
      };
    } else {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "HIGH_RISK",
        actionLevel: "EMERGENCY_VET_CONTACT",
        calculatedDose: mgPerKg,
        doseUnit: "mg/kg",
        ingredientKnown: true,
        messageKey: "CHOCOLATE_HIGH_NEURO",
      };
    }
  }
};
