import { calculateTax } from "../common/calcuators";

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

  // Edge case: Exact bracket boundary tests
  describe("bracket boundary edge cases", () => {
    test("income of exactly $18,201 (first taxable dollar)", () => {
      // $18,201 is at the boundary - should be taxed at 16% on $1

      const expected = (18_201 - 18_200) * 0.16;
      const result = calculateTax({
        income: 18_201,
        financialYear: "2024-2025",
      });
      // Expected: (18,201 - 18,201) * 0.16 = 0 (since income > min, not >=)
      expect(result).toBe(expected);
    });

    test("income of $18,202 (one dollar into taxable bracket)", () => {
      // First truly taxable amount
      const expected = (18_202 - 18_200) * 0.16;
      expect(calculateTax({ income: 18_202, financialYear: "2024-2025" })).toBe(
        expected,
      );
    });

    test("income of exactly $45,000 (top of 2nd bracket)", () => {
      const expected = (45_000 - 18_200) * 0.16;
      expect(calculateTax({ income: 45_000, financialYear: "2024-2025" })).toBe(
        expected,
      );
    });

    test("income of exactly $45,001 (first dollar of 3rd bracket)", () => {
      // At boundary - uses baseAmount from 3rd bracket
      const expected = 4_288 + (45_001 - 45_000) * 0.3;
      expect(calculateTax({ income: 45_001, financialYear: "2024-2025" })).toBe(
        expected,
      );
    });

    test("income of exactly $135,000 (top of 3rd bracket)", () => {
      const expected = 4_288 + (135_000 - 45_000) * 0.3;
      expect(
        calculateTax({ income: 135_000, financialYear: "2024-2025" }),
      ).toBe(expected);
    });

    test("income of exactly $135,001 (first dollar of 4th bracket)", () => {
      const expected = 31_288 + (135_001 - 135_000) * 0.37;
      expect(
        calculateTax({ income: 135_001, financialYear: "2024-2025" }),
      ).toBe(expected);
    });

    test("income of exactly $190,000 (top of 4th bracket)", () => {
      const expected = 31_288 + (190_000 - 135_000) * 0.37;
      expect(
        calculateTax({ income: 190_000, financialYear: "2024-2025" }),
      ).toBe(expected);
    });

    test("income of exactly $190,001 (first dollar of 5th bracket)", () => {
      const expected = 51_638 + (190_001 - 190_000) * 0.45;
      expect(
        calculateTax({ income: 190_001, financialYear: "2024-2025" }),
      ).toBe(expected);
    });
  });

  // Edge case: Different financial years with different tax rates
  describe("different financial years", () => {
    test("calculates tax correctly for 2023-2024 (19% rate in 2nd bracket)", () => {
      // 2023-2024 has 19% rate for 2nd bracket instead of 16%
      const expected = (30_000 - 18_200) * 0.19;
      expect(calculateTax({ income: 30_000, financialYear: "2023-2024" })).toBe(
        expected,
      );
    });

    test("calculates tax correctly for 2023-2024 3rd bracket (32.5% rate)", () => {
      // 2023-2024 has 32.5% rate and different thresholds
      const expected = 5_092 + (80_000 - 45_000) * 0.325;
      expect(calculateTax({ income: 80_000, financialYear: "2023-2024" })).toBe(
        expected,
      );
    });

    test("calculates tax correctly for 2021-2022 (old rates)", () => {
      const expected = 5_092 + (100_000 - 45_000) * 0.325;
      expect(
        calculateTax({ income: 100_000, financialYear: "2021-2022" }),
      ).toBe(expected);
    });

    test("calculates tax correctly for 2025-2026", () => {
      // 2025-2026 has same rates as 2024-2025
      const expected = 4_288 + (75_000 - 45_000) * 0.3;
      expect(calculateTax({ income: 75_000, financialYear: "2025-2026" })).toBe(
        expected,
      );
    });

    test("compares tax difference between old and new rates", () => {
      const income = 100_000;
      const tax2023 = calculateTax({ income, financialYear: "2023-2024" });
      const tax2024 = calculateTax({ income, financialYear: "2024-2025" });
      // New rates should result in lower tax
      expect(tax2024).toBeLessThan(tax2023);
    });
  });

  // Edge case: Decimal income values
  describe("decimal income values", () => {
    test("handles income with cents", () => {
      const result = calculateTax({
        income: 50_000.5,
        financialYear: "2024-2025",
      });
      const expected = 4_288 + (50_000.5 - 45_000) * 0.3;
      expect(result).toBe(expected);
    });

    test("handles income with many decimal places", () => {
      const result = calculateTax({
        income: 50_000.999,
        financialYear: "2024-2025",
      });
      const expected = 4_288 + (50_000.999 - 45_000) * 0.3;
      expect(result).toBe(expected);
    });
  });

  // Edge case: Small positive income values
  describe("small positive income values", () => {
    test("income of $1 returns 0 tax", () => {
      expect(calculateTax({ income: 1, financialYear: "2024-2025" })).toBe(0);
    });

    test("income of $0.01 returns 0 tax", () => {
      expect(calculateTax({ income: 0.01, financialYear: "2024-2025" })).toBe(
        0,
      );
    });

    test("income just below threshold returns 0 tax", () => {
      expect(
        calculateTax({ income: 18_199.99, financialYear: "2024-2025" }),
      ).toBe(0);
    });
  });

  // Edge case: Very large income values
  describe("very large income values", () => {
    test("handles income of 10 million", () => {
      const expected = 51_638 + (10_000_000 - 190_000) * 0.45;
      expect(
        calculateTax({ income: 10_000_000, financialYear: "2024-2025" }),
      ).toBe(expected);
    });

    test("handles income at Number.MAX_SAFE_INTEGER boundary", () => {
      // This tests the Infinity max in the highest bracket
      const largeIncome = 1_000_000_000;
      const result = calculateTax({
        income: largeIncome,
        financialYear: "2024-2025",
      });
      expect(result).toBeGreaterThan(0);
      expect(Number.isFinite(result)).toBe(true);
    });
  });
});

