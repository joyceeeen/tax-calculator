import  { useState } from 'react';
import { Calculator, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { calculateTax, FINANCIAL_YEARS, FinancialYear } from '@tax-calc/index';

export default function TaxCalculator() {
  const [selectedYear, setSelectedYear] = useState<FinancialYear>('2024-2025');
  const [income, setIncome] = useState('');
  const [result, setResult] = useState<number | null>(null);


  const handleCalculate = () => {
    const incomeValue = parseFloat(income);
    if (isNaN(incomeValue) || incomeValue < 0) {
      alert('Please enter a valid income amount');
      return;
    }

    const calculation = calculateTax({income: incomeValue, financialYear: selectedYear});
    setResult(calculation);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Australian Tax Calculator
            </h1>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            {/* Year Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Income Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as FinancialYear)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {FINANCIAL_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Income Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Total Taxable Income
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your taxable income"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Calculate Tax
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tax Breakdown
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Income Tax</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(result)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                  <span className="text-lg font-bold text-indigo-900">
                    Total Tax Payable
                  </span>
                  <span className="text-xl font-bold text-indigo-900">
                    {formatCurrency(result)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Effective Tax Rate</span>
                  <span className="font-semibold text-gray-900">
                    {result.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Tax Bracket:</span> sample bracket here
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This calculator provides estimates based on ATO tax rates for {selectedYear}. 
              For official calculations, visit ato.gov.au
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}