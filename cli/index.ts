import * as readline from "node:readline/promises";
import { calculateTax, FINANCIAL_YEARS, type FinancialYear } from "../packages/tax-calc/index";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const isValidFinancialYear = (year: string): year is FinancialYear =>
  FINANCIAL_YEARS.includes(year as FinancialYear);

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const yearInput = await rl.question(
    `Please enter the income year (eg: ${FINANCIAL_YEARS[0]}): `,
  );
  if (!isValidFinancialYear(yearInput)) {
    console.error(
      `\nInvalid income year. Supported years: ${FINANCIAL_YEARS.join(", ")}`,
    );
    rl.close();
    return;
  }

  const incomeInput = await rl.question(
    "\nPlease enter your total taxable income: ",
  );
  rl.close();

  const income = parseFloat(incomeInput);
  if (Number.isNaN(income) || income < 0) {
    console.error("\nInvalid income. Please enter a valid positive number.");
    return;
  }

  const tax = calculateTax({ financialYear: yearInput, income });
  console.log(
    `\nThe estimated tax on your taxable income is: ${formatCurrency(tax)}`,
  );
}

main();

