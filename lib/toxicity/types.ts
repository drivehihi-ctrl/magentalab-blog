export type DecisionMode =
  | "CALCULATED"
  | "NON_CALCULABLE"
  | "LIMITED_EVIDENCE";

export type RiskAssessment =
  | "LOW_ESTIMATED_RISK"
  | "CLINICAL_SIGNS_POSSIBLE"
  | "HIGH_RISK"
  | "NON_QUANTIFIABLE"
  | "LIMITED_EVIDENCE";

export type ActionLevel =
  | "OBSERVE_AND_VERIFY"
  | "CONTACT_VET"
  | "PROMPT_VET_CONTACT"
  | "EMERGENCY_VET_CONTACT";

export interface ToxicityInput {
  species: "dog" | "cat";
  weightKg: number;
  substanceId: string;
  substanceSubtype?: string;
  ingestionAmountGram?: number;
  isAmountUnknown?: boolean;
  productTotalGram?: number;
  xylitolPercent?: number;
  xylitolContentGram?: number;
  ingredientKnown?: boolean;
}

export interface ToxicityResult {
  decisionMode: DecisionMode;
  riskAssessment: RiskAssessment;
  actionLevel: ActionLevel;
  calculatedDose?: number; // mg/kg or g/kg
  doseUnit?: string;
  messageKey: string;
  detailsKey?: string;
  ingredientKnown?: boolean;
}

export interface ToxicSubstanceDefinition {
  id: string;
  evaluate: (input: ToxicityInput) => ToxicityResult;
}
