import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface ResultsTableProps {
  results: CalculationResult[];
  t: any;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, t }) => {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">{t.comparisonTable}</h3>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {results.length} {t.purchaseOptions}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.colOption}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.colPricePerGram}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                {t.colTotalPrice}
              </th>
               <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                {t.colWeight}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.colSavings}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.colStatus}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr 
                key={result.id} 
                className={`${result.isBest ? 'bg-green-50' : 'hover:bg-gray-50'} transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-500 mr-2">#{index + 1}</span>
                      {result.isBest && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {t.statusBest}
                           </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {result.mode === 'weight' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {t.statusByWeight}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          {t.statusByPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Mobile Only Details */}
                  <div className="sm:hidden mt-2 text-xs text-gray-500">
                    {formatNumber(result.grams)}g • {formatCurrency(result.totalPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  {formatCurrency(result.pricePerGram)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 hidden sm:table-cell">
                  {formatCurrency(result.totalPrice)}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 hidden sm:table-cell">
                  {formatNumber(result.grams)}g
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${result.isProfitable ? 'text-green-600' : 'text-red-500'}`}>
                  {result.isProfitable ? '+' : ''}{formatCurrency(result.savingsPerGram)}
                  <div className="text-xs opacity-75">
                    ({result.savingsPercentage.toFixed(2)}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                   {result.isProfitable ? (
                       <span className="text-green-500">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-auto">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                       </span>
                   ) : (
                       <span className="text-red-400">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-auto">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                       </span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;