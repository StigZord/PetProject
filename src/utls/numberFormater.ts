/**
 * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
 */
export const formatNumber = (
  value: number,
  fractionDigits: number = 2,
  locales?: string | string[]
) =>
  value.toLocaleString(locales, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export const formatPercent = (
  value: number,
  fractionDigits: number = 2,
  locales?: string | string[]
) =>
  value.toLocaleString(locales, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    style: 'percent',
  });
