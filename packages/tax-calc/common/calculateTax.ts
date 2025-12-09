import { strict as assert } from "node:assert";
import type { CalculateTaxParams } from "../types";
import { taxTable } from "./taxTable";

export const calculateTax = (params: CalculateTaxParams): number => {
  const { financialYear, income } = params;
  const brackets = taxTable[financialYear];

  const bracketIndex = brackets.findIndex(
    (bracket) => income >= bracket.min && income <= bracket.max,
  );

  if (bracketIndex === -1) return 0;

  const currentBracket = brackets[bracketIndex];

  assert(
    currentBracket,
    "Current bracket not found in the tax table, this should never happen!",
  );

  const { baseAmount, rate } = currentBracket;
  const previousBracketMax = brackets[bracketIndex - 1]?.max ?? 0;

  return baseAmount + (income - previousBracketMax) * rate;
};

