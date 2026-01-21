import React, { useState } from 'react';
import Header from './components/Header';
import PriceInputForm from './components/PriceInputForm';
import ResultsTable from './components/ResultsTable';
import BestDealCard from './components/BestDealCard';
import InfoSection from './components/InfoSection';
import { PurchaseOption, CalculationResult, FormErrors, Language } from './types';
import { calculateBestDeal } from './utils/calculations';
import { translations } from './utils/translations';

// Initial state helpers
const initialOptions: PurchaseOption[] = [
  // Default Option 1: Buy by Price, RM 10.00
  { id: '1', grams: '', totalPrice: '10.00', mode: 'price' },
  { id: '2', grams: '0.017', totalPrice: '', mode: 'weight' },
  { id: '3', grams: '0.018', totalPrice: '', mode: 'weight' },
  { id: '4', grams: '0.019', totalPrice: '', mode: 'weight' },
  { id: '5', grams: '0.020', totalPrice: '', mode: 'weight' },
  { id: '6', grams: '0.100', totalPrice: '', mode: 'weight' },
];

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ms');
  const [standardPrice, setStandardPrice] = useState<string>('');
  const [options, setOptions] = useState<PurchaseOption[]>(initialOptions);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasCalculated, setHasCalculated] = useState(false);

  const t = translations[language];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate Standard Price
    if (!standardPrice || isNaN(parseFloat(standardPrice)) || parseFloat(standardPrice) <= 0) {
      newErrors.standardPrice = t.errors.standardPrice;
      isValid = false;
    }

    // Validate Options
    const optionsErrors: { [key: string]: { grams?: string; totalPrice?: string } } = {};
    let hasOptionErrors = false;

    options.forEach((opt) => {
      const gramsVal = parseFloat(opt.grams);
      const priceVal = parseFloat(opt.totalPrice);
      
      const optError: { grams?: string; totalPrice?: string } = {};

      if (opt.grams !== '' && (isNaN(gramsVal) || gramsVal <= 0)) {
        optError.grams = t.errors.greaterThanZero;
        hasOptionErrors = true;
      }
      if (opt.totalPrice !== '' && (isNaN(priceVal) || priceVal <= 0)) {
        optError.totalPrice = t.errors.greaterThanZero;
        hasOptionErrors = true;
      }

      if (opt.grams && !opt.totalPrice) {
          optError.totalPrice = t.errors.required;
          hasOptionErrors = true;
      }
      if (!opt.grams && opt.totalPrice) {
          optError.grams = t.errors.required;
          hasOptionErrors = true;
      }

      // Special MIGA-i requirement check
       if (opt.totalPrice && priceVal < 10) {
        optError.totalPrice = t.errors.minRm10;
        hasOptionErrors = true;
      }

      if (Object.keys(optError).length > 0) {
        optionsErrors[opt.id] = optError;
      }
    });

    if (hasOptionErrors) {
      newErrors.options = optionsErrors;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = () => {
    if (validate()) {
      const calculatedResults = calculateBestDeal(standardPrice, options);
      setResults(calculatedResults);
      setHasCalculated(true);
      
      // Scroll to results on mobile
      if (window.innerWidth < 1024) {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
        setResults([]);
        setHasCalculated(false);
    }
  };

  const bestResult = results.find(r => r.isBest) || null;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ms' ? 'en' : 'ms');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Header language={language} toggleLanguage={toggleLanguage} t={t} />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Input Section */}
          <section className="lg:col-span-5 space-y-6 mb-8 lg:mb-0">
            <PriceInputForm
              standardPrice={standardPrice}
              setStandardPrice={setStandardPrice}
              options={options}
              setOptions={setOptions}
              onCalculate={handleCalculate}
              errors={errors}
              t={t}
            />
            
            <div className="hidden lg:block">
               <InfoSection t={t} />
            </div>
          </section>

          {/* Results Section */}
          <section id="results-section" className="lg:col-span-7 space-y-6">
            {hasCalculated && results.length > 0 ? (
              <div className="animate-slideUp">
                <BestDealCard bestResult={bestResult} t={t} />
                <ResultsTable results={results} t={t} />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 border border-dashed border-gray-300">
                {hasCalculated && results.length === 0 ? (
                     <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <p>{t.errors.noValidOptions}</p>
                     </div>
                ) : (
                    <div>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 mb-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                        </svg>
                        <p>{t.errors.enterDetails}</p>
                    </div>
                )}
              </div>
            )}
             <div className="lg:hidden">
               <InfoSection t={t} />
            </div>
          </section>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {t.title}. Not affiliated with Malayan Banking Berhad.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;