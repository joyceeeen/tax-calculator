import {
  calculateTaxResult,
  FINANCIAL_YEARS,
  type FinancialYear,
} from '@tax-calc/index';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function TaxCalculator() {
  const [selectedYear, setSelectedYear] = useState<FinancialYear>('2024-2025');
  const [income, setIncome] = useState('');
  const [isBracketsExpanded, setIsBracketsExpanded] = useState(false);

  const yearId = 'year-select';
  const incomeId = 'income-input';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const incomeValue = Number.parseFloat(income) || 0;

  const result = useMemo(() => {
    if (!income || incomeValue <= 0) return null;
    return calculateTaxResult({
      income: incomeValue,
      financialYear: selectedYear,
    });
  }, [income, incomeValue, selectedYear]);

  const takeHomePercent = result
    ? ((result.netIncome / result.income) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8 flex items-start justify-center">
      <div className="w-full max-w-lg pt-8 sm:pt-16">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">
                  Income Tax Calculator
                </h1>
                <p className="text-neutral-500 text-sm mt-0.5">
                  Australian Tax Office rates
                </p>
              </div>
              <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                FY {selectedYear}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Year Selection */}
              <div>
                <label
                  htmlFor={yearId}
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Financial Year
                </label>
                <div className="relative">
                  <select
                    id={yearId}
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(e.target.value as FinancialYear)
                    }
                    className="w-full h-11 px-3.5 pr-9 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-sm font-medium appearance-none cursor-pointer hover:bg-neutral-100 hover:border-neutral-300 focus:outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  >
                    {FINANCIAL_YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              {/* Income Input */}
              <div>
                <label
                  htmlFor={incomeId}
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium pointer-events-none">
                    $
                  </span>
                  <input
                    id={incomeId}
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-7 pr-3.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-sm font-medium placeholder:text-neutral-400 placeholder:font-normal hover:bg-neutral-100 hover:border-neutral-300 focus:outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {result ? (
            <>
              {/* Primary Result */}
              <div className="px-6 py-6 bg-neutral-100">
                <div className="text-center">
                  <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">
                    Take Home Pay
                  </p>
                  <p className="text-3xl sm:text-4xl font-semibold text-neutral-900 tabular-nums tracking-tight">
                    {formatCurrency(result.netIncome)}
                  </p>
                  <p className="text-neutral-500 text-sm mt-1">
                    {takeHomePercent}% of gross income
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-neutral-700 transition-all duration-500 ease-out"
                      style={{
                        width: `${(result.netIncome / result.income) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-neutral-400 transition-all duration-500 ease-out"
                      style={{
                        width: `${(result.incomeTax / result.income) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-neutral-300 transition-all duration-500 ease-out"
                      style={{
                        width: `${(result.medicareLevy / result.income) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-700" />
                      Net
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-400" />
                      Tax
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-300" />
                      Medicare
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="px-6 py-5 border-t border-neutral-100">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-neutral-600">
                      Gross Income
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                      {formatCurrency(result.income)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-neutral-100">
                    <span className="text-sm text-neutral-600">Income Tax</span>
                    <span className="text-sm font-medium text-neutral-700 tabular-nums">
                      −{formatCurrency(result.incomeTax)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600">
                        Medicare Levy
                      </span>
                      <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                        2%
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-700 tabular-nums">
                      −{formatCurrency(result.medicareLevy)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t-2 border-neutral-200">
                    <span className="text-sm font-semibold text-neutral-900">
                      Net Income
                    </span>
                    <span className="text-base font-bold text-neutral-900 tabular-nums">
                      {formatCurrency(result.netIncome)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Brackets - Collapsible */}
              <div className="border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsBracketsExpanded(!isBracketsExpanded)}
                  className="flex items-center justify-between w-full px-6 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-sm font-medium text-neutral-600">
                    View Tax Brackets
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                      isBracketsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isBracketsExpanded
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 space-y-1">
                      {result.taxTable.map((bracket, index) => {
                        const isCurrentBracket =
                          index === result.taxBracketIndex;
                        const formatRange = (min: number, max: number) => {
                          if (max === Infinity) {
                            return `${formatCurrency(min)}+`;
                          }
                          return `${formatCurrency(min)} – ${formatCurrency(max)}`;
                        };

                        return (
                          <div
                            key={`${bracket.min}-${bracket.max}`}
                            className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
                              isCurrentBracket ? 'bg-neutral-100' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isCurrentBracket
                                    ? 'bg-neutral-900'
                                    : 'bg-neutral-300'
                                }`}
                              />
                              <span
                                className={`text-sm tabular-nums ${
                                  isCurrentBracket
                                    ? 'font-medium text-neutral-900'
                                    : 'text-neutral-500'
                                }`}
                              >
                                {formatRange(bracket.min, bracket.max)}
                              </span>
                            </div>
                            <span
                              className={`text-sm tabular-nums ${
                                isCurrentBracket
                                  ? 'font-semibold text-neutral-900'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {(bracket.rate * 100).toFixed(0)}%
                            </span>
                          </div>
                        );
                      })}
                      {result.taxBracketIndex >= 0 &&
                        (() => {
                          const currentBracket =
                            result.taxTable[result.taxBracketIndex];
                          if (!currentBracket) return null;
                          return (
                            <p className="text-xs text-neutral-500 mt-3 px-3">
                              Your marginal rate:{' '}
                              {(currentBracket.rate * 100).toFixed(0)}%
                              {currentBracket.baseAmount > 0 && (
                                <span className="text-neutral-400">
                                  {' '}
                                  · Base:{' '}
                                  {formatCurrency(currentBracket.baseAmount)}
                                </span>
                              )}
                            </p>
                          );
                        })()}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="px-6 py-12 text-center border-t border-neutral-100">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="text-xl text-neutral-400">$</span>
              </div>
              <p className="text-neutral-500 text-sm">
                Enter your annual income to calculate
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400 mt-6 px-4">
          Estimates based on ATO rates. Excludes HELP, offsets & deductions.{' '}
          <a
            href="https://www.ato.gov.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-700 underline underline-offset-2 transition-colors"
          >
            ato.gov.au
          </a>
        </p>
      </div>
    </div>
  );
}
