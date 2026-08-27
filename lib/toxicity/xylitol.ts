import { ToxicityInput, ToxicityResult, ToxicSubstanceDefinition } from "./types";

export const xylitol: ToxicSubstanceDefinition = {
  id: "xylitol",
  evaluate: (input: ToxicityInput): ToxicityResult => {
    // If the ingredient amount is unknown or missing inputs for calculation
    const hasActualContent = input.xylitolContentGram !== undefined && input.xylitolContentGram > 0;
    const hasPercent = input.productTotalGram !== undefined && input.productTotalGram > 0 && input.xylitolPercent !== undefined && input.xylitolPercent > 0;

    if (!hasActualContent && !hasPercent) {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "NON_QUANTIFIABLE",
        actionLevel: "PROMPT_VET_CONTACT",
        ingredientKnown: false,
        messageKey: "XYLITOL_UNKNOWN",
      };
    }

    let actualXylitolGram = 0;
    if (hasActualContent) {
      actualXylitolGram = input.xylitolContentGram!;
    } else {
      actualXylitolGram = input.productTotalGram! * (input.xylitolPercent! / 100);
    }

    const gPerKg = actualXylitolGram / input.weightKg;

    if (gPerKg < 0.1) {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "LOW_ESTIMATED_RISK",
        actionLevel: "OBSERVE_AND_VERIFY",
        calculatedDose: gPerKg,
        doseUnit: "g/kg",
        ingredientKnown: true,
        messageKey: "XYLITOL_LOW",
      };
    } else if (gPerKg < 0.5) {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "HIGH_RISK",
        actionLevel: "PROMPT_VET_CONTACT",
        calculatedDose: gPerKg,
        doseUnit: "g/kg",
        ingredientKnown: true,
        messageKey: "XYLITOL_HYPOGLYCEMIA",
      };
    } else {
      return {
        decisionMode: "CALCULATED",
        riskAssessment: "HIGH_RISK",
        actionLevel: "EMERGENCY_VET_CONTACT",
        calculatedDose: gPerKg,
        doseUnit: "g/kg",
        ingredientKnown: true,
        messageKey: "XYLITOL_HEPATIC",
      };
    }
  }
};
