import { ToxicityInput, ToxicityResult, ToxicSubstanceDefinition } from "./types";
import { chocolate } from "./chocolate";
import { grapes } from "./grapes";
import { xylitol } from "./xylitol";
import { allium } from "./allium";
import { lilies } from "./lilies";

const substances: Record<string, ToxicSubstanceDefinition> = {
  chocolate,
  grapes,
  xylitol,
  allium,
  lilies,
};

export function evaluateToxicity(input: ToxicityInput): ToxicityResult {
  const substance = substances[input.substanceId];
  if (!substance) {
    throw new Error(`Unknown substance ID: ${input.substanceId}`);
  }
  return substance.evaluate(input);
}
