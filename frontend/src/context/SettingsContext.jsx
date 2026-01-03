import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("globeTrotterCurrency") || "USD";
  });

  // Exchange rates expressed as USD per 1 unit of currency (e.g. 1 EUR = 1.09 USD)
  const exchangeRates = {
    USD: 1,
    EUR: 1.09,
    GBP: 1.25,
    INR: 0.012, // 1 INR ~= 0.012 USD
    JPY: 0.0067, // 1 JPY ~= 0.0067 USD
    AUD: 0.65, // 1 AUD ~= 0.65 USD
    CAD: 0.74, // 1 CAD ~= 0.74 USD
    CHF: 1.08, // 1 CHF ~= 1.08 USD
  };

  const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
  };

  const currencyNames = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    INR: "Indian Rupee",
    JPY: "Japanese Yen",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
  };

  const availableCurrencies = Object.keys(exchangeRates);

  useEffect(() => {
    localStorage.setItem("globeTrotterCurrency", currency);
  }, [currency]);

  const convertFromUSD = (amountUSD) => {
    const rate = exchangeRates[currency] || 1;
    return amountUSD / rate; // amount in selected currency
  };

  const convertToUSD = (amountInSelected) => {
    const rate = exchangeRates[currency] || 1;
    return parseFloat(amountInSelected || 0) * rate; // amount in USD
  };

  const formatCurrency = (amountUSD) => {
    const amount = convertFromUSD(parseFloat(amountUSD || 0));
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(amount);
    } catch {
      // fallback if Intl doesn't support currency code
      return `${symbols[currency] || ""}${amount.toFixed(2)}`;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        symbols,
        currencyNames,
        availableCurrencies,
        formatCurrency,
        convertFromUSD,
        convertToUSD,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
