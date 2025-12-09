import { calculateTax } from "../calculateTax";

describe("calculateTax", () => {
  test("returns 0 tax for negative income", () => {
    expect(calculateTax({ income: -1000, financialYear: "2024-2025" })).toBe(0);
  });

  test("returns 0 tax for income below tax-free threshold", () => {
    expect(calculateTax({ income: 0, financialYear: "2024-2025" })).toBe(0);

    expect(calculateTax({ income: 18_200, financialYear: "2024-2025" })).toBe(
      0,
    );
  });

  test("calculates tax correctly for the 2nd bracket (18,201 to 45,000)", () => {
    // Example: income = $20,000
    // Taxable over threshold: 20,000 - 18,200 = 1,800
    // Rate = 0.16
    const expected = (20_000 - 18_200) * 0.16;

    expect(
      calculateTax({ income: 20_000, financialYear: "2024-2025" }),
    ).toBeCloseTo(expected);
  });

  test("calculates tax correctly for the 3rd bracket (45,001 to 135,000)", () => {
    // Example: income = $50,000
    // Bracket: base = 4,288
    // Extra = (50k - 45k) * 0.30
    const expected = 4_288 + (50_000 - 45_000) * 0.3;

    expect(
      calculateTax({ income: 50_000, financialYear: "2024-2025" }),
    ).toBeCloseTo(expected);
  });

  test("calculates tax correctly for the 4th bracket (135,001 to 190,000)", () => {
    const expected = 31_288 + (150_000 - 135_000) * 0.37;

    expect(
      calculateTax({ income: 150_000, financialYear: "2024-2025" }),
    ).toBeCloseTo(expected);
  });

  test("calculates tax correctly for the 5th bracket (190,001+)", () => {
    const expected = 51_638 + (250_000 - 190_000) * 0.45;

    expect(
      calculateTax({ income: 250_000, financialYear: "2024-2025" }),
    ).toBeCloseTo(expected);
  });

  test("calculates tax correctly for a very high income", () => {
    const expected = 51_638 + (1_000_000 - 190_000) * 0.45;

    expect(
      calculateTax({ income: 1_000_000, financialYear: "2024-2025" }),
    ).toBeCloseTo(expected);
  });
});
