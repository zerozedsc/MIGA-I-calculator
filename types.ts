export type InputMode = 'weight' | 'price';

export interface PurchaseOption {
  id: string;
  grams: string;
  totalPrice: string;
  mode: InputMode;
}

export interface CalculationResult {
  id: string;
  grams: number;
  totalPrice: number;
  pricePerGram: number;
  savingsPerGram: number;
  savingsPercentage: number;
  isProfitable: boolean;
  isBest: boolean;
  mode: InputMode;
}

export interface FormErrors {
  standardPrice?: string;
  options?: {
    [key: string]: {
      grams?: string;
      totalPrice?: string;
    };
  };
}

export type Language = 'ms' | 'en';