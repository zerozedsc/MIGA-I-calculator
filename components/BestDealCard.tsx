import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface BestDealCardProps {
  bestResult: CalculationResult | null;
  t: any;
}

const BestDealCard: React.FC<BestDealCardProps> = ({ bestResult, t }) => {
  if (!bestResult) return null;

  const isWeightMode = bestResult.mode === 'weight';

  return (
    <div className="bg-green-500 rounded-xl shadow-xl p-6 text-white mb-6 relative overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full blur-xl -ml-10 -mb-10"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-white text-green-600 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            {t.winner}
          </span>
          <h2 className="text-xl font-bold">{t.bestValueTitle}</h2>
        </div>

        <div className="mb-4">
          <p className="text-green-50 text-xs font-semibold uppercase tracking-wider opacity-80 mb-0.5">{t.pricePerGram}</p>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
            {formatCurrency(bestResult.pricePerGram)}<span className="text-2xl font-normal text-green-100">/g</span>
          </div>
        </div>

        {/* Purchase Details Box - Styled like screenshot */}
        <div className="border-2 border-white border-opacity-30 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm mb-4">
          <p className="text-[10px] text-white uppercase tracking-widest font-bold mb-1 opacity-90">
             {t.purchaseDetails}
          </p>
          
          <div className="flex flex-col">
            {isWeightMode ? (
              // Mode: WEIGHT (Highlight Grams)
              <>
                 <div className="text-3xl font-extrabold mb-0.5">
                   {formatNumber(bestResult.grams)} g
                 </div>
                 <div className="text-sm font-medium opacity-90">
                   {t.for} {formatCurrency(bestResult.totalPrice)}
                 </div>
                 <div className="mt-2 inline-block bg-white text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider self-start">
                   {t.purchaseInstructionWeight}
                 </div>
              </>
            ) : (
               // Mode: PRICE (Highlight RM)
               <>
                 <div className="text-3xl font-extrabold mb-0.5">
                   {formatCurrency(bestResult.totalPrice)}
                 </div>
                 <div className="text-sm font-medium opacity-90">
                   {t.for} {formatNumber(bestResult.grams)} g
                 </div>
                 <div className="mt-2 inline-block bg-white text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider self-start">
                   {t.purchaseInstructionPrice}
                 </div>
               </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            {bestResult.isProfitable ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="bg-white text-green-600 rounded-full p-0.5 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg">
                        {t.youSave} {formatCurrency(bestResult.savingsPerGram)}/g
                    </span>
                  </div>
                  <span className="text-green-800 text-xs font-bold bg-green-200 bg-opacity-80 px-2 py-1 rounded shadow-sm">
                    {bestResult.savingsPercentage.toFixed(2)}% {t.cheaperThanStandard}
                  </span>
                </>
            ) : (
                 <div className="flex items-center gap-2 text-red-100 bg-red-900 bg-opacity-20 px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="text-sm font-medium">{t.expensiveThanStandard}</span>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BestDealCard;