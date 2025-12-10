import type { CalculateTaxParams, CalculateTaxResult } from '../types';
import { MEDICARE_LEVY_RATE, TAX_TABLE } from './constants';

export const calculateTax = (params: CalculateTaxParams): number => {
  const { financialYear, income } = params;
  const brackets = TAX_TABLE[financialYear];

  const bracketIndex = findTaxBracketIndex(params);

  if (bracketIndex === -1) return 0;

  const currentBracket = brackets[bracketIndex];

  if (!currentBracket) {
    console.error(
      'Current bracket not found in the tax table, this should never happen as its already handled above! ',
    );
    return 0;
  }

  const { baseAmount, rate } = currentBracket;
  const previousBracketMax = brackets[bracketIndex - 1]?.max ?? 0;

  return baseAmount + (income - previousBracketMax) * rate;
};

const findTaxBracketIndex = (params: CalculateTaxParams): number => {
  const { financialYear, income } = params;

  return TAX_TABLE[financialYear].findIndex(
    (bracket) => income >= bracket.min && income <= bracket.max,
  );
};

export const calculateMedicareLevy = (params: CalculateTaxParams): number => {
  const { income } = params;
  return income * MEDICARE_LEVY_RATE;
};

export const calculateTaxResult = (
  params: CalculateTaxParams,
): CalculateTaxResult => {
  const { income, financialYear } = params;

  const taxBracketIndex = findTaxBracketIndex(params);
  const taxTable = TAX_TABLE[financialYear];

  const incomeTax = calculateTax(params);
  const medicareLevy = calculateMedicareLevy(params);

  const deductions = incomeTax + medicareLevy;
  const netIncome = income - deductions;

  return {
    ...params,
    netIncome,
    incomeTax,
    medicareLevy,
    deductions,
    taxBracketIndex,
    taxTable,
  };
};
