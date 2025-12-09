import {
  type CalculateTaxResult,
  calculateTaxResult,
  FINANCIAL_YEARS,
  type FinancialYear,
  type TaxBracket,
} from '@tax-calc/index';
import { cn } from '@utils/cn';
import { formatCurrency, formatPercent, formatRange } from '@utils/helpers';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

const SEGMENTS = [
  { key: 'net', color: 'bg-neutral-700', label: 'Net' },
  { key: 'tax', color: 'bg-neutral-400', label: 'Tax' },
  { key: 'medicare', color: 'bg-neutral-300', label: 'Medicare' },
] as const;

function ProgressBar({
  values,
  total,
}: {
  values: { net: number; tax: number; medicare: number };
  total: number;
}) {
  return (
    <div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex">
        {SEGMENTS.map(({ key, color }) => (
          <div
            key={key}
            className={cn(color, 'transition-all duration-500 ease-out')}
            style={{ width: `${(values[key] / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        {SEGMENTS.map(({ key, color, label }) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', color)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  isNegative,
  isBold,
  badge,
}: {
  label: string;
  value: string;
  isNegative?: boolean;
  isBold?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-sm',
            isBold ? 'font-semibold text-neutral-900' : 'text-neutral-600',
          )}
        >
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
      <span
        className={cn(
          'tabular-nums',
          isBold
            ? 'text-base font-bold text-neutral-900'
            : 'text-sm font-medium text-neutral-700',
        )}
      >
        {isNegative && '−'}
        {value}
      </span>
    </div>
  );
}

function TaxBracketRow({
  bracket,
  isCurrent,
}: {
  bracket: TaxBracket;
  isCurrent: boolean;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_4rem_5rem] p-1 justify-between items-center rounded-lg transition-colors',
        isCurrent && 'bg-neutral-100',
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            isCurrent ? 'bg-neutral-900' : 'bg-neutral-300',
          )}
        />
        <span
          className={cn(
            'text-sm tabular-nums',
            isCurrent ? 'font-medium text-neutral-900' : 'text-neutral-500',
          )}
        >
          {formatRange(bracket.min, bracket.max)}
        </span>
      </div>
      <span
        className={cn(
          'text-sm tabular-nums text-center',
          isCurrent ? 'font-semibold text-neutral-900' : 'text-neutral-400',
        )}
      >
        {formatPercent(bracket.rate)}
      </span>
      <span
        className={cn(
          'text-sm tabular-nums text-right',
          isCurrent ? 'font-semibold text-neutral-900' : 'text-neutral-400',
        )}
      >
        {formatCurrency(bracket.baseAmount)}
      </span>
    </div>
  );
}

function TaxBracketsAccordion({
  taxTable,
  currentIndex,
  isExpanded,
  onToggle,
}: {
  taxTable: TaxBracket[];
  currentIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const currentBracket = taxTable[currentIndex];

  return (
    <div className="gap-4 flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full"
      >
        <span className="text-sm font-medium text-neutral-600">
          View Tax Brackets
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-[1fr_4rem_5rem] gap-4 items-center text-xs font-medium text-neutral-400 tracking-wide">
              <span>Income Range</span>
              <span className="text-center">Rate</span>
              <span className="text-right">Base</span>
            </div>

            <div className="gap-1 flex flex-col">
              {taxTable.map((bracket, i) => (
                <TaxBracketRow
                  key={bracket.min}
                  bracket={bracket}
                  isCurrent={i === currentIndex}
                />
              ))}

              {currentBracket && (
                <p className="text-xs text-neutral-500 mt-3 px-3">
                  Your marginal rate: {formatPercent(currentBracket.rate)}
                  {currentBracket.baseAmount > 0 && (
                    <span className="text-neutral-400">
                      {' '}
                      · Base: {formatCurrency(currentBracket.baseAmount)}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsSection({
  result,
  isBracketsExpanded,
  onToggleBrackets,
}: {
  result: CalculateTaxResult;
  isBracketsExpanded: boolean;
  onToggleBrackets: () => void;
}) {
  const { income, netIncome, incomeTax, medicareLevy, taxTable, taxBracketIndex } = result;
  const takeHomePercent = formatPercent((netIncome / income));

  return (
    <div>
      <div className="p-6 gap-4 flex flex-col bg-neutral-100">
        <div className="text-center">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">
            Take Home Pay
          </p>
          <p className="text-3xl sm:text-4xl font-semibold text-neutral-900 tabular-nums tracking-tight">
            {formatCurrency(netIncome)}
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            {takeHomePercent}% of gross income
          </p>
        </div>
        <ProgressBar
          values={{ net: netIncome, tax: incomeTax, medicare: medicareLevy }}
          total={income}
        />
      </div>

      <div className="p-6 border-t border-neutral-100 flex flex-col gap-4">
        <BreakdownRow label="Gross Income" value={formatCurrency(income)} isBold />
        <div className="border-t border-neutral-100" />
        <BreakdownRow label="Income Tax" value={formatCurrency(incomeTax)} isNegative />
        <div className="border-t border-neutral-100" />
        <BreakdownRow
          label="Medicare Levy"
          value={formatCurrency(medicareLevy)}
          isNegative
          badge="2%"
        />
        <div className="border-t-2 border-neutral-200" />
        <BreakdownRow label="Net Income" value={formatCurrency(netIncome)} isBold />

        <TaxBracketsAccordion
          taxTable={taxTable}
          currentIndex={taxBracketIndex}
          isExpanded={isBracketsExpanded}
          onToggle={onToggleBrackets}
        />
      </div>
    </div>
  );
}

export default function TaxCalculator() {
  const [selectedYear, setSelectedYear] = useState<FinancialYear>('2024-2025');
  const [income, setIncome] = useState('');
  const [isBracketsExpanded, setIsBracketsExpanded] = useState(false);

  const result = useMemo(() => {
    const value = Number.parseFloat(income);
    if (!value || value <= 0) return null;
    return calculateTaxResult({ income: value, financialYear: selectedYear });
  }, [income, selectedYear]);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8 flex items-start justify-center">
      <div className="w-full max-w-lg pt-8 sm:pt-16">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">
                  Income Tax Calculator
                </h1>
                <p className="text-neutral-500 text-sm mt-0.5">
                  Australian Tax rates
                </p>
              </div>
              <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                FY {selectedYear}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="year-select"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Financial Year
                </label>
                <div className="relative">
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value as FinancialYear)}
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

              <div>
                <label
                  htmlFor="income-input"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium pointer-events-none">
                    $
                  </span>
                  <input
                    id="income-input"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="1"
                    className="w-full h-11 pl-7 pr-3.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-sm font-medium placeholder:text-neutral-400 placeholder:font-normal hover:bg-neutral-100 hover:border-neutral-300 focus:outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {result ? (
            <ResultsSection
              result={result}
              isBracketsExpanded={isBracketsExpanded}
              onToggleBrackets={() => setIsBracketsExpanded((prev) => !prev)}
            />
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
