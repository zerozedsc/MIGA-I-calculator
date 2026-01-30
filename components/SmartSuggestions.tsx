import React, { useEffect, useMemo, useState } from 'react';
import { PurchaseOption } from '../types';
import {
    findSmartPriceSuggestions,
    SuggestionInput,
    SmartSuggestion,
} from '../utils/smartPriceSuggestions';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface SmartSuggestionsProps {
    standardPrice: number;
    options: PurchaseOption[];
    t: any;
    onApplySuggestion: (suggestedPrice: number, displayedWeight: number) => void;
}

const toSuggestionInputs = (options: PurchaseOption[]): SuggestionInput[] => {
    const inputs: SuggestionInput[] = [];

    for (const opt of options) {
        const grams = parseFloat(opt.grams);
        const price = parseFloat(opt.totalPrice);

        if (opt.mode === 'price') {
            if (Number.isFinite(price) && price > 0) {
                inputs.push({ method: 'BY_PRICE', price });
            }
            continue;
        }

        if (opt.mode === 'weight') {
            if (Number.isFinite(grams) && grams > 0) {
                inputs.push({ method: 'BY_WEIGHT', weight: grams });
            }
        }
    }

    return inputs;
};

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
    standardPrice,
    options,
    t,
    onApplySuggestion,
}) => {
    const [showAll, setShowAll] = useState(false);
    const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

    const suggestionInputs = useMemo(() => toSuggestionInputs(options), [options]);

    useEffect(() => {
        // Only show when user has 2+ inputs, per reference spec.
        if (!Number.isFinite(standardPrice) || standardPrice <= 0 || suggestionInputs.length < 2) {
            setSuggestions([]);
            setShowAll(false);
            return;
        }

        const results = findSmartPriceSuggestions(standardPrice, suggestionInputs, 5);
        setSuggestions(results);
    }, [standardPrice, suggestionInputs]);

    if (suggestions.length === 0) {
        return null;
    }

    const maxSavingsPerGram = suggestions.reduce((max, s) => Math.max(max, s.savingsPerGram), 0);
    const visibleCount = showAll ? suggestions.length : Math.min(3, suggestions.length);
    const visible = suggestions.slice(0, visibleCount);

    return (
        <div className="bg-gradient-to-br from-maybank-yellow/10 via-orange-50 to-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
            <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-maybank-yellow to-orange-400 flex items-center justify-center text-black font-extrabold shadow-sm">
                        AI
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                                {t.smartSuggestionsTitle}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                                {t.predictionTag}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                            {t.smartSuggestionsSubtitle}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <div className="text-[11px] font-semibold text-orange-900">{t.upTo}</div>
                    <div className="text-sm sm:text-base font-extrabold text-orange-900">
                        {formatCurrency(maxSavingsPerGram)}/g
                    </div>
                    <div className="text-[11px] text-gray-600">{t.predictionLabel}</div>
                </div>
            </div>

            <div className="px-4 sm:px-5 pb-4">
                {/* Mobile: horizontal swipe cards (minimal vertical space) */}
                <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                    {suggestions.slice(0, 5).map((s) => (
                        <SuggestionCard
                            key={`${s.suggestedPrice}-${s.displayedWeight}`}
                            suggestion={s}
                            t={t}
                            onApply={() => onApplySuggestion(s.suggestedPrice, s.displayedWeight)}
                        />
                    ))}
                </div>

                {/* Desktop/tablet: compact rows + optional show more */}
                <div className="hidden sm:block space-y-2">
                    {visible.map((s) => (
                        <SuggestionRow
                            key={`${s.suggestedPrice}-${s.displayedWeight}`}
                            suggestion={s}
                            t={t}
                            onApply={() => onApplySuggestion(s.suggestedPrice, s.displayedWeight)}
                        />
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                    {suggestions.length > 3 ? (
                        <button
                            type="button"
                            onClick={() => setShowAll((v) => !v)}
                            className="hidden sm:inline text-sm font-bold text-orange-800 hover:underline"
                        >
                            {showAll ? t.showLess : t.showMore}
                        </button>
                    ) : (
                        <span />
                    )}
                    <span className="text-xs text-gray-500">{t.smartSuggestionsFootnote}</span>
                </div>
            </div>
        </div>
    );
};

const SuggestionCard: React.FC<{
    suggestion: SmartSuggestion;
    t: any;
    onApply: () => void;
}> = ({ suggestion, t, onApply }) => {
    const badgeClass = suggestion.isBest
        ? 'bg-gradient-to-r from-maybank-yellow to-orange-500 text-black'
        : 'bg-orange-100 text-orange-900';

    return (
        <div className={`min-w-[230px] bg-white rounded-xl border ${suggestion.isBest ? 'border-orange-300' : 'border-gray-200'} p-3`}>
            <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-extrabold px-2 py-1 rounded-full ${badgeClass}`}>
                    {suggestion.isBest ? t.bestTag : t.suggestionTag}
                </span>
                <div className="text-[11px] font-bold text-orange-800">
                    {formatCurrency(suggestion.savingsPerGram)}/g
                </div>
            </div>

            <div className="mt-2">
                <div className="text-xl font-extrabold text-gray-900">{formatCurrency(suggestion.suggestedPrice)}</div>
                <div className="text-sm font-bold text-orange-700">→ {formatNumber(suggestion.displayedWeight, 3)}g</div>
                <div className="mt-1 text-xs text-gray-600">
                    {suggestion.savingsPercentage.toFixed(2)}% {t.cheaperThanStandard}
                </div>
                <div className="mt-0.5 text-xs text-gray-600">
                    {t.colPricePerGram}:{' '}
                    <span className="font-bold text-gray-800">{formatCurrency(suggestion.pricePerGram)}/g</span>
                </div>
            </div>

            <button
                type="button"
                onClick={onApply}
                className="mt-3 w-full bg-gradient-to-r from-maybank-yellow to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-extrabold py-2.5 px-4 rounded-xl shadow-sm transition-colors"
            >
                {t.tryThis}
            </button>
        </div>
    );
};

const SuggestionRow: React.FC<{
    suggestion: SmartSuggestion;
    t: any;
    onApply: () => void;
}> = ({ suggestion, t, onApply }) => {
    const badgeClass = suggestion.isBest
        ? 'bg-gradient-to-r from-maybank-yellow to-orange-500 text-black'
        : 'bg-orange-100 text-orange-900';

    return (
        <div
            className={`bg-white rounded-xl border ${suggestion.isBest ? 'border-orange-300 shadow-sm' : 'border-gray-200'} p-3 sm:p-4`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-extrabold px-2 py-1 rounded-full ${badgeClass}`}>
                            {suggestion.isBest ? t.bestTag : t.suggestionTag}
                        </span>
                        <div className="text-sm sm:text-base font-extrabold text-gray-900">
                            {formatCurrency(suggestion.suggestedPrice)}
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="text-sm sm:text-base font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                            {formatNumber(suggestion.displayedWeight, 3)}g
                        </div>
                    </div>

                    <div className="mt-1 text-xs text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>
                            {t.predictedSavings}:{' '}
                            <span className="font-bold text-orange-800">{formatCurrency(suggestion.savingsPerGram)}/g</span>{' '}
                            <span className="text-gray-500">({suggestion.savingsPercentage.toFixed(2)}%)</span>
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>
                            {t.colPricePerGram}:{' '}
                            <span className="font-bold text-gray-800">{formatCurrency(suggestion.pricePerGram)}/g</span>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onApply}
                    className="shrink-0 bg-gradient-to-r from-maybank-yellow to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-extrabold py-2.5 px-4 rounded-xl shadow-sm transition-colors"
                >
                    {t.tryThis}
                </button>
            </div>
        </div>
    );
};

export default SmartSuggestions;
