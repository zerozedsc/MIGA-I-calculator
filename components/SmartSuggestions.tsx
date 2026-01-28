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
  const [expanded, setExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  const suggestionInputs = useMemo(() => toSuggestionInputs(options), [options]);

  useEffect(() => {
    // Only show when user has 2+ inputs, per reference spec.
    if (!Number.isFinite(standardPrice) || standardPrice <= 0 || suggestionInputs.length < 2) {
      setSuggestions([]);
      setExpanded(false);
      return;
    }

    const results = findSmartPriceSuggestions(standardPrice, suggestionInputs, 5);
    setSuggestions(results);

    // Auto-expand when we found a strong suggestion.
    if (results.length > 0 && results[0].savingsPercentage >= 1) {
      setExpanded(true);
    }
  }, [standardPrice, suggestionInputs]);

  if (suggestions.length === 0) {
    return null;
  }

  const maxSaving = suggestions[0]?.savingsAmount ?? 0;

  return (
    <div className="bg-gradient-to-br from-maybank-yellow/10 via-orange-50 to-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-orange-50/60 transition-colors"
        aria-expanded={expanded}
        aria-controls="smart-suggestions-content"
      >
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

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-orange-100 text-orange-900 px-3 py-2 rounded-full border border-orange-200">
            <span className="text-xs font-semibold">{t.upTo}</span>
            <span className="text-sm font-extrabold">{formatCurrency(maxSaving)}</span>
          </div>
          <svg
            className={`w-6 h-6 text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div id="smart-suggestions-content" className="px-4 sm:px-5 pb-5">
          <div className="mt-3 mb-4 bg-white/70 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold">?</div>
              <div className="text-sm text-gray-800">
                <p className="font-bold text-gray-900 mb-1">{t.smartSuggestionsHowTitle}</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t.smartSuggestionsHowBody}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {suggestions.map((s) => (
              <SuggestionRow
                key={`${s.suggestedPrice}-${s.displayedWeight}`}
                suggestion={s}
                t={t}
                onApply={() => onApplySuggestion(s.suggestedPrice, s.displayedWeight)}
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            {t.smartSuggestionsFootnote}
          </p>
        </div>
      )}
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
      className={`bg-white rounded-xl border ${suggestion.isBest ? 'border-orange-300 shadow-md' : 'border-gray-200'} p-4`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-extrabold px-2 py-1 rounded-full ${badgeClass}`}>
              {suggestion.isBest ? t.bestTag : t.suggestionTag}
            </span>
            <span className="text-xs text-gray-500">
              {t.predictionLabel}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-3 flex-wrap">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {formatCurrency(suggestion.suggestedPrice)}
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-lg sm:text-xl font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
              {formatNumber(suggestion.displayedWeight, 3)}g
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <div>
              <span className="font-semibold">{t.actualWeightLabel}:</span>{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded">{formatNumber(suggestion.actualWeight, 6)}g</code>
              <span className="ml-2 text-gray-500">({t.beforeRounding})</span>
            </div>
            <div>
              <span className="font-semibold">{t.naivePriceLabel}:</span>{' '}
              <span>{formatCurrency(suggestion.naivePrice)}</span>
              <span className="ml-2 text-gray-500">({t.expectedForDisplayedWeight})</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-stretch sm:items-end gap-3">
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-center min-w-[150px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
              {t.predictedSavings}
            </div>
            <div className="text-2xl font-extrabold text-orange-700">
              {formatCurrency(suggestion.savingsAmount)}
            </div>
            <div className="text-xs text-orange-700 font-semibold">
              {suggestion.savingsPercentage.toFixed(2)}% {t.cheaperThanNaive}
            </div>
          </div>

          <button
            type="button"
            onClick={onApply}
            className="bg-gradient-to-r from-maybank-yellow to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-extrabold py-3 px-5 rounded-xl shadow-sm transition-colors"
          >
            {t.tryThis}
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
        {t.smartSuggestionExplanation
          .replace('{displayedWeight}', formatNumber(suggestion.displayedWeight, 3))
          .replace('{suggestedPrice}', suggestion.suggestedPrice.toFixed(2))
          .replace('{naivePrice}', suggestion.naivePrice.toFixed(2))
          .replace('{savings}', suggestion.savingsAmount.toFixed(2))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
