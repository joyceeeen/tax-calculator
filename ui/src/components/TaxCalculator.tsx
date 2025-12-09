import {
  calculateTaxResult,
  FINANCIAL_YEARS,
  type FinancialYear,
} from '@tax-calc/index';
import {
  Calculator,
  Calendar,
  DollarSign,
  FileText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function TaxCalculator() {
  const [selectedYear, setSelectedYear] = useState<FinancialYear>('2024-2025');
  const [income, setIncome] = useState('');

  const yearId = 'year-select';
  const incomeId = 'income-input';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Input Section */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10">
              <header className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-100 rounded-xl">
                  <Calculator className="w-7 h-7 text-indigo-600" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Australian Tax Calculator
                </h1>
              </header>

              <div className="flex flex-col gap-6">
                {/* Year Selection */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={yearId}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Financial Year
                  </label>
                  <select
                    id={yearId}
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(e.target.value as FinancialYear)
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    {FINANCIAL_YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Income Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={incomeId}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Annual Taxable Income
                  </label>
                  <input
                    id={incomeId}
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="Enter your income"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 bg-gray-50 p-6 sm:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-gray-100">
              {result ? (
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Summary
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm sm:text-base text-gray-600">
                        Gross Monthly Salary
                      </span>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {formatCurrency(result.income)}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        Annual Deductions
                      </h3>

                      <div className="space-y-2 ml-4 sm:ml-6">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-gray-600 pr-2">
                            Medicare Levy (2.0%)
                          </span>
                          <span className="text-red-600 text-right">
                            -{formatCurrency(0)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-gray-600 pr-2">Income Tax</span>
                          <span className="text-red-600 text-right">
                            -{formatCurrency(result.incomeTax)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2 mt-3 border-t">
                        <span className="text-sm sm:text-base text-gray-600">
                          Total Deductions
                        </span>
                        <span className="font-medium text-red-600 text-sm sm:text-base">
                          -{formatCurrency(result.incomeTax)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          <span className="pr-2">Net Annual Income</span>
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-green-600">
                          {formatCurrency(result.netIncome)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm max-w-[200px]">
                    Enter your income to see your tax summary
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Estimates based on ATO tax rates for {selectedYear}. For official
            calculations, visit{' '}
            <a
              href="https://www.ato.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              ato.gov.au
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
