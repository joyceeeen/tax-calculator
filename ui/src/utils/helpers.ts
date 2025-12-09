export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number) =>
  CURRENCY_FORMATTER.format(value);

export const formatRange = (min: number, max: number) =>
  max === Infinity
    ? `${formatCurrency(min)}+`
    : `${formatCurrency(min)} – ${formatCurrency(max)}`;

export const formatPercent = (rate: number) => `${(rate * 100).toFixed(0)}%`;
