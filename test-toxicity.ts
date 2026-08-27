import { evaluateToxicity } from "./lib/toxicity/index.ts";
import { ToxicityInput } from "./lib/toxicity/types.ts";
import assert from "assert";

function runTests() {
  console.log("Running Toxicity V2 Tests...");

  // 1. Dog grape (5kg, 1g)
  let res = evaluateToxicity({ species: "dog", weightKg: 5, substanceId: "grapes", ingestionAmountGram: 1 });
  assert.strictEqual(res.decisionMode, "NON_CALCULABLE");
  assert.strictEqual(res.actionLevel, "PROMPT_VET_CONTACT");

  // 2. Dog raisin (30kg, 1g)
  res = evaluateToxicity({ species: "dog", weightKg: 30, substanceId: "grapes", ingestionAmountGram: 1 });
  assert.strictEqual(res.decisionMode, "NON_CALCULABLE");
  assert.strictEqual(res.actionLevel, "PROMPT_VET_CONTACT");

  // 3. Cat grape (4kg, 5g)
  res = evaluateToxicity({ species: "cat", weightKg: 4, substanceId: "grapes", ingestionAmountGram: 5 });
  assert.strictEqual(res.decisionMode, "LIMITED_EVIDENCE");
  assert.strictEqual(res.actionLevel, "CONTACT_VET");

  // 4. Cat true lily (4kg, 0.1g)
  res = evaluateToxicity({ species: "cat", weightKg: 4, substanceId: "lilies", substanceSubtype: "TRUE_LILY_LILIUM", ingestionAmountGram: 0.1 });
  assert.strictEqual(res.decisionMode, "NON_CALCULABLE");
  assert.strictEqual(res.actionLevel, "EMERGENCY_VET_CONTACT");
  assert.strictEqual(res.calculatedDose, undefined);

  // 5. Milk chocolate dog (10kg, 100g, 2.3mg/g -> 23mg/kg)
  res = evaluateToxicity({ species: "dog", weightKg: 10, substanceId: "chocolate", substanceSubtype: "MILK_CHOCOLATE", ingestionAmountGram: 100 });
  assert.strictEqual(Math.round((res.calculatedDose || 0) * 10) / 10, 23);
  assert.strictEqual(res.riskAssessment, "CLINICAL_SIGNS_POSSIBLE");

  // 6. Baker chocolate dog (10kg, 50g, 15.5mg/g -> 77.5mg/kg)
  res = evaluateToxicity({ species: "dog", weightKg: 10, substanceId: "chocolate", substanceSubtype: "BAKERS_UNSWEETENED_CHOCOLATE", ingestionAmountGram: 50 });
  assert.strictEqual(res.calculatedDose, 77.5);
  assert.strictEqual(res.riskAssessment, "HIGH_RISK");

  // 7. Xylitol (10kg dog, actual 1g -> 0.1g/kg -> hypoglycemia risk)
  res = evaluateToxicity({ species: "dog", weightKg: 10, substanceId: "xylitol", xylitolContentGram: 1, ingredientKnown: true });
  assert.strictEqual(res.calculatedDose, 0.1);
  assert.strictEqual(res.riskAssessment, "HIGH_RISK");
  assert.strictEqual(res.messageKey, "XYLITOL_HYPOGLYCEMIA");

  // 8. Xylitol unknown concentration
  res = evaluateToxicity({ species: "dog", weightKg: 10, substanceId: "xylitol", ingredientKnown: false });
  assert.strictEqual(res.decisionMode, "CALCULATED");
  assert.strictEqual(res.riskAssessment, "NON_QUANTIFIABLE");
  assert.strictEqual(res.actionLevel, "PROMPT_VET_CONTACT");

  // 9. Onion cat (생양파와 마늘 공식 다르게 처리되는지 -> allium은 모두 LIMITED_EVIDENCE에 다른 messageKey)
  res = evaluateToxicity({ species: "cat", weightKg: 5, substanceId: "allium", substanceSubtype: "GARLIC_FRESH", ingestionAmountGram: 10 });
  assert.strictEqual(res.detailsKey, "ALLIUM_GARLIC_WARNING");
  assert.strictEqual(res.decisionMode, "LIMITED_EVIDENCE");

  res = evaluateToxicity({ species: "cat", weightKg: 5, substanceId: "allium", substanceSubtype: "ONION_FRESH", ingestionAmountGram: 10 });
  assert.strictEqual(res.detailsKey, undefined);

  // 10. Dog unknown chocolate
  res = evaluateToxicity({ species: "dog", weightKg: 5, substanceId: "chocolate", substanceSubtype: "UNKNOWN_CHOCOLATE", ingestionAmountGram: 50 });
  assert.strictEqual(res.riskAssessment, "NON_QUANTIFIABLE");
  assert.strictEqual(res.actionLevel, "PROMPT_VET_CONTACT");

  // 11. Cat peace lily
  res = evaluateToxicity({ species: "cat", weightKg: 4, substanceId: "lilies", substanceSubtype: "PEACE_LILY" });
  assert.strictEqual(res.riskAssessment, "LIMITED_EVIDENCE");
  assert.strictEqual(res.actionLevel, "PROMPT_VET_CONTACT");

  // 12. Cat unknown lily
  res = evaluateToxicity({ species: "cat", weightKg: 4, substanceId: "lilies", substanceSubtype: "UNKNOWN_LILY" });
  assert.strictEqual(res.riskAssessment, "NON_QUANTIFIABLE");
  assert.strictEqual(res.actionLevel, "PROMPT_VET_CONTACT");

  // 13. Dog grape amount unknown vs 0g
  // unknown
  res = evaluateToxicity({ species: "dog", weightKg: 5, substanceId: "grapes", ingestionAmountGram: 0, isAmountUnknown: true });
  assert.strictEqual(res.riskAssessment, "NON_QUANTIFIABLE");
  // 0g (not ingested)
  res = evaluateToxicity({ species: "dog", weightKg: 5, substanceId: "grapes", ingestionAmountGram: 0, isAmountUnknown: false });
  assert.strictEqual(res.riskAssessment, "LOW_ESTIMATED_RISK");

  console.log("All tests passed successfully!");
}

runTests();
