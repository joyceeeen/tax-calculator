import type { CalculateTaxParams, CalculateTaxResult, TaxBracket } from "../types";
import { taxTable } from "./taxTable";

export const calculateTax = (params: CalculateTaxParams): number => {
  const { financialYear, income } = params;
  const brackets = taxTable[financialYear];

  const bracketIndex = brackets.findIndex(
    (bracket) => income >= bracket.min && income <= bracket.max,
  );

  if (bracketIndex === -1) return 0;

  const currentBracket = brackets[bracketIndex];

  if(!currentBracket) {
   console.error('Current bracket not found in the tax table, this should never happen as its already handled above! ');
   return 0;
  }

  const { baseAmount, rate } = currentBracket;
  const previousBracketMax = brackets[bracketIndex - 1]?.max ?? 0;

  return baseAmount + (income - previousBracketMax) * rate;
};

const getTaxBracket = (params: CalculateTaxParams): TaxBracket | null => {
  const { financialYear, income } = params;

  const taxBracket = taxTable[financialYear].find(bracket => income >= bracket.min && income <= bracket.max);

  if(!taxBracket) {
      console.error('Tax bracket not found in the tax table, this should never happen as its already handled above! ');
  return null;
  }
  
  return taxBracket;
}

export const calculateMedicareLevy = (params: CalculateTaxParams): number => {
  const { income } = params;
  return income * 0.02;
}


export const calculateTaxResult = (params: CalculateTaxParams): CalculateTaxResult => {
  const { income } = params;
  const incomeTax = calculateTax(params);
  const taxBracket = getTaxBracket(params);
  const medicareLevy = calculateMedicareLevy(params);
  const deductions = incomeTax + medicareLevy;
  const netIncome = income - deductions;

  return {
    ...params,
    netIncome,
    incomeTax,
    medicareLevy,
    deductions,
    taxBracket,
  }
}
