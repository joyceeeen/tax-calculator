export type TaxBracket = {
  min: number;
  max: number;
  rate: number;
  baseAmount: number;
};

export const FINANCIAL_YEARS = [
  '2021-2022',
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
] as const;

export type FinancialYear = (typeof FINANCIAL_YEARS)[number];

export type TaxTable = Record<FinancialYear, TaxBracket[]>;

export type CalculateTaxParams = {
  financialYear: FinancialYear;
  income: number;
};

export type CalculateTaxResult = {
  financialYear: FinancialYear;
  incomeTax: number;
  income: number;
  netIncome: number;
  medicareLevy: number;
  deductions: number;
  taxTable: TaxBracket[];
  taxBracketIndex: number;
};
