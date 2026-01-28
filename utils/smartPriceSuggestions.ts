export interface SmartSuggestion {
    suggestedPrice: number; // RM (2dp)
    displayedWeight: number; // g (3dp) - what MIGA-i shows
    actualWeight: number; // g (6dp) - before rounding
    pricePerGram: number; // RM/g (2dp) - based on displayedWeight
    savingsPerGram: number; // RM/g (2dp) - standardPrice - pricePerGram
    savingsAmount: number; // RM (2dp) - savingsPerGram * displayedWeight
    savingsPercentage: number; // % (2dp) - savingsPerGram / standardPrice
    isBest: boolean;
}

export type SuggestionInputMethod = 'BY_PRICE' | 'BY_WEIGHT';

export interface SuggestionInput {
    method: SuggestionInputMethod;
    price?: number;
    weight?: number;
}

const roundTo = (value: number, decimals: number) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const extractPriceRange = (userInputs: SuggestionInput[], standardPrice: number): number[] => {
    const prices: number[] = [];

    for (const input of userInputs) {
        let price = 0;

        if (input.method === 'BY_PRICE' && typeof input.price === 'number') {
            price = input.price;
        } else if (input.method === 'BY_WEIGHT' && typeof input.weight === 'number') {
            price = input.weight * standardPrice;
        }

        // MIGA-i minimum purchase
        if (Number.isFinite(price) && price >= 10) {
            prices.push(price);
        }
    }

    return prices;
};

const generateTargetWeights = (
    minPrice: number,
    maxPrice: number,
    standardPrice: number
): number[] => {
    const maxWeight = maxPrice / standardPrice;

    const weights: number[] = [];

    // Start from 0.015g based on the reference doc.
    // Walk in 0.001g increments (3dp) up to the maxWeight.
    for (let w = 0.015; w <= maxWeight + 0.005; w += 0.001) {
        weights.push(roundTo(w, 3));
    }

    return weights;
};

const findOptimalPriceForWeight = (
    standardPrice: number,
    targetWeight: number,
    searchMinPrice: number,
    searchMaxPrice: number
): Omit<SmartSuggestion, 'isBest'> | null => {
    // Weight rounding is to 3dp.
    // For displayed targetWeight (e.g. 0.016), the actual weight must be:
    // [targetWeight - 0.0005, targetWeight + 0.00049999]
    const minActualWeight = targetWeight - 0.0005;
    const maxActualWeight = targetWeight + 0.00049999;

    const minPriceForWeight = minActualWeight * standardPrice;
    const maxPriceForWeight = maxActualWeight * standardPrice;

    // Convert to cents range.
    const startCents = Math.ceil(minPriceForWeight * 100);
    const endCents = Math.floor(maxPriceForWeight * 100);

    const boundedStart = Math.ceil(clamp(startCents / 100, searchMinPrice, searchMaxPrice) * 100);
    const boundedEnd = Math.floor(clamp(endCents / 100, searchMinPrice, searchMaxPrice) * 100);

    if (boundedEnd < boundedStart) {
        return null;
    }

    let optimalPrice: number | null = null;

    for (let cents = boundedStart; cents <= boundedEnd; cents++) {
        const price = cents / 100;

        if (price < 10) {
            continue;
        }

        const actualWeight = price / standardPrice;
        const displayedWeight = roundTo(actualWeight, 3);

        if (displayedWeight === targetWeight) {
            optimalPrice = price;
            break; // first match is cheapest
        }
    }

    if (optimalPrice === null) {
        return null;
    }

    const actualWeight = optimalPrice / standardPrice;

    // IMPORTANT: Match the app's own comparison logic.
    // The app calculates price-per-gram from the user-entered grams (which in this case is the
    // *displayed* weight, 3dp) and total price.
    // Example: RM10.54 for 0.016g => 10.54/0.016 = 658.75 RM/g
    const pricePerGram = optimalPrice / targetWeight;
    const savingsPerGram = standardPrice - pricePerGram;
    const savingsPercentage = standardPrice > 0 ? (savingsPerGram / standardPrice) * 100 : 0;
    const savingsAmount = savingsPerGram * targetWeight;

    return {
        suggestedPrice: Number(optimalPrice.toFixed(2)),
        displayedWeight: Number(targetWeight.toFixed(3)),
        actualWeight: Number(actualWeight.toFixed(6)),
        pricePerGram: Number(pricePerGram.toFixed(2)),
        savingsPerGram: Number(savingsPerGram.toFixed(2)),
        savingsAmount: Number(savingsAmount.toFixed(2)),
        savingsPercentage: Number(savingsPercentage.toFixed(2)),
    };
};

/**
 * Generate smart "Buy by Price" suggestions that exploit MIGA-i 3dp rounding.
 *
 * Notes:
 * - This is best-effort and uses the user's current price range as a search window.
 * - Savings are *predictions* based on rounding behavior (as per the reference doc).
 */
export const findSmartPriceSuggestions = (
    standardPrice: number,
    userInputs: SuggestionInput[],
    maxSuggestions: number = 5
): SmartSuggestion[] => {
    if (!Number.isFinite(standardPrice) || standardPrice <= 0) {
        return [];
    }

    if (!Array.isArray(userInputs) || userInputs.length < 2) {
        return [];
    }

    const priceRange = extractPriceRange(userInputs, standardPrice);
    if (priceRange.length < 2) {
        return [];
    }

    const minUserPrice = Math.min(...priceRange);
    const maxUserPrice = Math.max(...priceRange);

    const searchMinPrice = Math.max(10, minUserPrice - 2);
    const searchMaxPrice = maxUserPrice + 3;

    const targetWeights = generateTargetWeights(searchMinPrice, searchMaxPrice, standardPrice);

    const suggestions: SmartSuggestion[] = [];

    for (const targetWeight of targetWeights) {
        const suggestion = findOptimalPriceForWeight(standardPrice, targetWeight, searchMinPrice, searchMaxPrice);

        if (!suggestion) {
            continue;
        }

        // Only include if meaningful savings (keep small-noise out).
        // Note: savings are computed per-gram, matching the rest of the app.
        if (suggestion.savingsPerGram > 0 && suggestion.savingsPercentage > 0.3) {
            suggestions.push({ ...suggestion, isBest: false });
        }
    }

    suggestions.sort((a, b) => b.savingsPercentage - a.savingsPercentage);

    if (suggestions.length > 0) suggestions[0].isBest = true;
    if (suggestions.length > 1) suggestions[1].isBest = true;

    return suggestions.slice(0, maxSuggestions);
};
