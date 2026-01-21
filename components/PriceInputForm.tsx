import React from 'react';
import { PurchaseOption, FormErrors, InputMode } from '../types';

interface PriceInputFormProps {
  standardPrice: string;
  setStandardPrice: (value: string) => void;
  options: PurchaseOption[];
  setOptions: (options: PurchaseOption[]) => void;
  onCalculate: () => void;
  errors: FormErrors;
  t: any;
}

// Internal SmartInput Component
const SmartInput = ({
  value,
  onChange,
  decimals,
  placeholder,
  className,
  id,
}: {
  value: string;
  onChange: (val: string) => void;
  decimals: number;
  placeholder?: string;
  className?: string;
  id?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Strip non-digits
    const digits = raw.replace(/\D/g, '');

    if (!digits) {
      onChange('');
      return;
    }

    const num = parseInt(digits, 10);
    const divisor = Math.pow(10, decimals);
    const formatted = (num / divisor).toFixed(decimals);
    onChange(formatted);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
};

const PriceInputForm: React.FC<PriceInputFormProps> = ({
  standardPrice,
  setStandardPrice,
  options,
  setOptions,
  onCalculate,
  errors,
  t,
}) => {
  const handleOptionChange = (id: string, field: 'grams' | 'totalPrice', value: string) => {
    const newOptions = options.map((opt) =>
      opt.id === id ? { ...opt, [field]: value } : opt
    );
    setOptions(newOptions);
  };

  const toggleMode = (id: string) => {
    const newOptions = options.map((opt) =>
      opt.id === id ? { ...opt, mode: opt.mode === 'price' ? 'weight' : 'price' as InputMode } : opt
    );
    setOptions(newOptions);
  };

  const addOption = () => {
    const newId = Date.now().toString();
    setOptions([...options, { id: newId, grams: '', totalPrice: '', mode: 'weight' }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const calculateMinGrams = (): string => {
    const price = parseFloat(standardPrice);
    if (!isNaN(price) && price > 0) {
      // RM 10 min purchase. ceil to 3 decimals to ensure > RM10
      return (Math.ceil((10 / price) * 1000) / 1000).toFixed(3);
    }
    return '';
  };

  const applyMinGramsToFirst = () => {
      const minGrams = calculateMinGrams();
      if (minGrams && options.length > 0) {
          const newOptions = [...options];
          // Since it's based on RM10, we switch to 'price' mode for clarity
          newOptions[0] = { ...newOptions[0], mode: 'price', totalPrice: '10.00', grams: minGrams };
          setOptions(newOptions);
      }
  };

  const minGrams = calculateMinGrams();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-maybank-yellow bg-black rounded-full p-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t.marketData}
        </h2>

        {/* Standard Price Input */}
        <div className="mb-8">
          <label htmlFor="standardPrice" className="block text-sm font-medium text-gray-700 mb-1">
            {t.standardPriceLabel}
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400 sm:text-sm">RM</span>
            </div>
            <SmartInput
              id="standardPrice"
              decimals={2}
              placeholder="0.00"
              className={`block w-full rounded-md border-gray-700 pl-12 pr-4 py-3 shadow-sm focus:border-maybank-yellow focus:ring-maybank-yellow sm:text-sm bg-gray-900 text-gray-400 placeholder-gray-600 border ${errors.standardPrice ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              value={standardPrice}
              onChange={(val) => setStandardPrice(val)}
            />
          </div>
          {errors.standardPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.standardPrice}</p>
          )}
          <div className="mt-2 text-xs text-gray-500 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span>{t.checkLivePrice}</span>
            {minGrams && (
                <button 
                  onClick={applyMinGramsToFirst}
                  className="text-maybank-dark font-medium hover:underline text-left"
                  title="Click to set Option 1 weight"
                >
                    {t.minPurchaseLink.replace('{grams}', minGrams)}
                </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
            {t.purchaseOptions}
        </h2>

        {/* Dynamic Options */}
        <div className="space-y-4">
          {options.map((option, index) => {
            const isWeightMode = option.mode === 'weight';
            
            return (
              <div key={option.id} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t.option} {index + 1}</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={!isWeightMode}
                        onChange={() => toggleMode(option.id)}
                      />
                      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-maybank-yellow rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-maybank-yellow"></div>
                      <span className="ms-2 text-xs font-medium text-gray-600">
                        {isWeightMode ? t.buyByWeight : t.buyByPrice}
                      </span>
                    </label>
                  </div>
                  {options.length > 1 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 self-end sm:self-auto"
                      aria-label="Remove option"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* First Input Position */}
                  {isWeightMode ? (
                     // Mode: Weight -> Price. Show Grams first.
                     <div>
                       <label htmlFor={`grams-${option.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                         {t.inputWeight}
                       </label>
                       <SmartInput
                         id={`grams-${option.id}`}
                         decimals={3}
                         placeholder="0.000"
                         className={`block w-full rounded-md border-gray-700 py-2 px-3 shadow-sm focus:border-maybank-yellow focus:ring-maybank-yellow sm:text-sm bg-gray-900 text-gray-400 placeholder-gray-600 border ${errors.options?.[option.id]?.grams ? 'border-red-500' : ''}`}
                         value={option.grams}
                         onChange={(val) => handleOptionChange(option.id, 'grams', val)}
                       />
                        {errors.options?.[option.id]?.grams && (
                             <p className="mt-1 text-xs text-red-600">{errors.options[option.id].grams}</p>
                         )}
                     </div>
                  ) : (
                     // Mode: Price -> Weight. Show Price first.
                     <div>
                        <label htmlFor={`price-${option.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          {t.inputTotal}
                        </label>
                        <SmartInput
                          id={`price-${option.id}`}
                          decimals={2}
                          placeholder="0.00"
                          className={`block w-full rounded-md border-gray-700 py-2 px-3 shadow-sm focus:border-maybank-yellow focus:ring-maybank-yellow sm:text-sm bg-gray-900 text-gray-400 placeholder-gray-600 border ${errors.options?.[option.id]?.totalPrice ? 'border-red-500' : ''}`}
                          value={option.totalPrice}
                          onChange={(val) => handleOptionChange(option.id, 'totalPrice', val)}
                        />
                         {errors.options?.[option.id]?.totalPrice && (
                             <p className="mt-1 text-xs text-red-600">{errors.options[option.id].totalPrice}</p>
                         )}
                     </div>
                  )}

                  {/* Second Input Position */}
                  {isWeightMode ? (
                      // Mode: Weight -> Price. Show Price second.
                     <div>
                        <label htmlFor={`price-${option.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          {t.resultingPrice}
                        </label>
                        <SmartInput
                          id={`price-${option.id}`}
                          decimals={2}
                          placeholder="0.00"
                          className={`block w-full rounded-md border-gray-700 py-2 px-3 shadow-sm focus:border-maybank-yellow focus:ring-maybank-yellow sm:text-sm bg-gray-900 text-gray-400 placeholder-gray-600 border ${errors.options?.[option.id]?.totalPrice ? 'border-red-500' : ''}`}
                          value={option.totalPrice}
                          onChange={(val) => handleOptionChange(option.id, 'totalPrice', val)}
                        />
                         {errors.options?.[option.id]?.totalPrice && (
                             <p className="mt-1 text-xs text-red-600">{errors.options[option.id].totalPrice}</p>
                         )}
                     </div>
                  ) : (
                      // Mode: Price -> Weight. Show Grams second.
                     <div>
                       <label htmlFor={`grams-${option.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                         {t.resultingWeight}
                       </label>
                       <SmartInput
                         id={`grams-${option.id}`}
                         decimals={3}
                         placeholder="0.000"
                         className={`block w-full rounded-md border-gray-700 py-2 px-3 shadow-sm focus:border-maybank-yellow focus:ring-maybank-yellow sm:text-sm bg-gray-900 text-gray-400 placeholder-gray-600 border ${errors.options?.[option.id]?.grams ? 'border-red-500' : ''}`}
                         value={option.grams}
                         onChange={(val) => handleOptionChange(option.id, 'grams', val)}
                       />
                        {errors.options?.[option.id]?.grams && (
                             <p className="mt-1 text-xs text-red-600">{errors.options[option.id].grams}</p>
                         )}
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={addOption}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-maybank-yellow hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t.addOption}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <button
          onClick={onCalculate}
          className="w-full bg-maybank-yellow text-black font-bold py-3 px-4 rounded-lg shadow-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maybank-yellow transition-transform transform active:scale-95 text-lg"
        >
          {t.calculate}
        </button>
      </div>
    </div>
  );
};

export default PriceInputForm;