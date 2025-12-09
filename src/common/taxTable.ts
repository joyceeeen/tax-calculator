import type { TaxTable } from "../types";

// Reference: https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents#ato-Australianresidenttaxrates2020to2026
export const taxTable: TaxTable = {
  "2021-2022": [
    { min: 0, max: 18_200, rate: 0, baseAmount: 0 },
    { min: 18_201, max: 45_000, rate: 0.19, baseAmount: 0 },
    { min: 45_001, max: 120_000, rate: 0.325, baseAmount: 5_092 },
    { min: 120_001, max: 180_000, rate: 0.37, baseAmount: 29_467 },
    { min: 180_001, max: Infinity, rate: 0.45, baseAmount: 51_667 },
  ],
  "2022-2023": [
    { min: 0, max: 18_200, rate: 0, baseAmount: 0 },
    { min: 18_201, max: 45_000, rate: 0.19, baseAmount: 0 },
    { min: 45_001, max: 120_000, rate: 0.325, baseAmount: 5_092 },
    { min: 120_001, max: 180_000, rate: 0.37, baseAmount: 29_467 },
    { min: 180_001, max: Infinity, rate: 0.45, baseAmount: 51_667 },
  ],
  "2023-2024": [
    { min: 0, max: 18_200, rate: 0, baseAmount: 0 },
    { min: 18_201, max: 45_000, rate: 0.19, baseAmount: 0 },
    { min: 45_001, max: 120_000, rate: 0.325, baseAmount: 5_092 },
    { min: 120_001, max: 180_000, rate: 0.37, baseAmount: 29_467 },
    { min: 180_001, max: Infinity, rate: 0.45, baseAmount: 51_667 },
  ],
  "2024-2025": [
    { min: 0, max: 18_200, rate: 0, baseAmount: 0 },
    { min: 18_201, max: 45_000, rate: 0.16, baseAmount: 0 },
    { min: 45_001, max: 135_000, rate: 0.30, baseAmount: 4_288 },
    { min: 135_001, max: 190_000, rate: 0.37, baseAmount: 31_288 },
    { min: 190_001, max: Infinity, rate: 0.45, baseAmount: 51_638 },
  ],
  "2025-2026": [
    { min: 0, max: 18_200, rate: 0, baseAmount: 0 },
    { min: 18_201, max: 45_000, rate: 0.16, baseAmount: 0 },
    { min: 45_001, max: 135_000, rate: 0.30, baseAmount: 4_288 },
    { min: 135_001, max: 190_000, rate: 0.37, baseAmount: 31_288 },
    { min: 190_001, max: Infinity, rate: 0.45, baseAmount: 51_638 },
  ],
};
