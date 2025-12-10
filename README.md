# 🧮 Australian Tax Calculator

A comprehensive Australian Income Tax Calculator featuring a shared calculation package, CLI tool, and modern React UI.

## Features

- 📊 **Tax Calculation** based on official ATO tax tables (FY 2021-2026)
- 💊 **Medicare Levy** calculation (2%)
- 🖥️ **CLI Tool** for quick terminal-based calculations
- 🎨 **React UI** with modern, responsive design
- ✅ **Fully Typed** with TypeScript
- 🧪 **Tested** with Jest

## Project Structure

```
tax-calculator/
├── apps/
│   ├── cli/
│   │   └── index.ts              # Command-line interface
│   └── ui/                       # React + Vite application
├── packages/
│   └── tax-calc/                 # Core calculation library
│       ├── index.ts              # Public exports
│       ├── types.ts              # TypeScript types
│       ├── common/
│       │   ├── calcuators.ts     # Tax calculation logic
│       │   └── constants.ts      # Tax brackets & constants
│       └── tests/
│           └── calculator.test.ts
├── biome.json
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tax-calculator.git
cd tax-calculator

# Install root dependencies
npm install

# Install UI dependencies
npm run ui:install
```

## Usage

### 🎨 Run the UI (React App)

Start the development server:

```bash
npm run ui:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Build for Production

```bash
npm run ui:build
```

#### Preview Production Build

```bash
npm run ui:preview
```

### 💻 Run the CLI

```bash
npm run cli
```

You'll be prompted to enter:
1. Financial year (e.g., `2024-2025`)
2. Your annual taxable income

Example:
```
Please enter the income year (eg: 2021-2022): 2024-2025
Please enter your total taxable income: 100000

The estimated tax on your taxable income is: $20,788.00
```

### 🧪 Run Tests

```bash
npm test
```

### 🧹 Linting & Formatting

```bash
# Check for issues
npm run biome:check

# Auto-fix issues
npm run biome:fix
```

## Supported Financial Years

| Financial Year | Status |
|----------------|--------|
| 2021-2022 | ✅ |
| 2022-2023 | ✅ |
| 2023-2024 | ✅ |
| 2024-2025 | ✅ |
| 2025-2026 | ✅ |

## Tax Calculation

The calculator uses the official ATO tax rates for Australian residents. It calculates:

- **Income Tax** - Based on progressive tax brackets
- **Medicare Levy** - 2% of taxable income
- **Net Income** - Gross income minus deductions

> ⚠️ **Disclaimer**: This calculator provides estimates only. It excludes HELP/HECS repayments, tax offsets, and other deductions. For accurate tax advice, consult the [ATO](https://www.ato.gov.au) or a registered tax professional.

## Reference

- [ATO Tax Rates - Australian Residents](https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents)
