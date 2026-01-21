import { PurchaseOption, CalculationResult } from '../types';

export const calculateBestDeal = (
  standardPriceStr: string,
  options: PurchaseOption[]
): CalculationResult[] => {
  const standardPrice = parseFloat(standardPriceStr);

  // If standard price is invalid, we can't calculate savings, but we can still calculate ppg
  // However, the app logic relies heavily on comparison.
  const isValidStandard = !isNaN(standardPrice) && standardPrice > 0;

  const results: CalculationResult[] = options
    .map((option) => {
      const grams = parseFloat(option.grams);
      const totalPrice = parseFloat(option.totalPrice);

      if (isNaN(grams) || grams <= 0 || isNaN(totalPrice) || totalPrice <= 0) {
        return null;
      }

      const pricePerGram = totalPrice / grams;
      // If standard price isn't set, we assume 0 savings but still show ppg
      const savingsPerGram = isValidStandard ? standardPrice - pricePerGram : 0;
      const savingsPercentage = isValidStandard && standardPrice !== 0
        ? (savingsPerGram / standardPrice) * 100
        : 0;

      return {
        id: option.id,
        grams,
        totalPrice,
        pricePerGram,
        savingsPerGram,
        savingsPercentage,
        isProfitable: savingsPerGram > 0,
        isBest: false, // Placeholder, calculated below
        mode: option.mode,
      };
    })
    .filter((res): res is CalculationResult => res !== null);

  // Sort by Price Per Gram (Ascending) - Cheapest first
  results.sort((a, b) => a.pricePerGram - b.pricePerGram);

  // Mark the best deal
  if (results.length > 0) {
    // Check if there are ties? For now, simply taking the first one.
    results[0].isBest = true;
  }

  return results;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 3) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};