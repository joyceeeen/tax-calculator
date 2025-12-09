import { taxTable } from "./common/taxTable";
import type { CalculateTaxParams } from "./types";

export const calculateTax = (params: CalculateTaxParams): number => {
  const { financialYear, income } = params;
  const brackets = taxTable[financialYear];

  const bracket = brackets.find(
    (bracket) => income > bracket.min && income <= bracket.max,
  );

  if (!bracket) {
    return 0;
  }

  const tax = bracket.baseAmount + (income - bracket.min) * bracket.rate;

  return Math.round(tax);
};
