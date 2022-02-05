// `toLocaleCompare` method with uncommon options, tend to take significantly longer,
// than expected (confirmed that by running performance monitoring in Chrome).
// by using cache the there is very noticeable difference.
const formattedPriceCache = new Map<number, string>();
const spreadCache = new Map<number, string>();
const percentCache = new Map<number, string>();

const priceFormatterOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const spreadFormatterOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

const percentFormatterOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'percent',
};

export const priceFormatter = (
  price: number,
  locale: string | string[] = 'en-US'
): string => {
  if (formattedPriceCache.has(price)) {
    return formattedPriceCache.get(price)!;
  }
  const formattedPrice = price.toLocaleString(locale, priceFormatterOptions);
  formattedPriceCache.set(price, formattedPrice);
  return formattedPrice;
};

export const integerFormatter = (
  value: number,
  locale: string | string[] = 'en-US'
): string => {
  return value.toLocaleString(locale);
};

export const formatSpreadNumber = (
  value: number,
  locales: string | string[] = 'en-US'
): string => {
  if (spreadCache.has(value)) {
    return spreadCache.get(value)!;
  }

  const spread = value.toLocaleString(locales, spreadFormatterOptions);
  spreadCache.set(value, spread);
  return spread;
};

export const formatPercent = (
  value: number,
  locales: string | string[] = 'en-US'
): string => {
  if (percentCache.has(value)) {
    return percentCache.get(value)!;
  }

  const percentFormatted = value.toLocaleString(
    locales,
    percentFormatterOptions
  );
  percentCache.set(value, percentFormatted);
  return percentFormatted;
};
