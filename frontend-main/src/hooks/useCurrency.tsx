import React, { useMemo } from "react";
import { countries } from "src/utilities/constants/countries";

const useCurrency = () => {
  const countryCurrency = useMemo(() => {
    return countries.map((country) => ({
      currencyName: country.currency,
      currencySymbol: country.currency_symbol,
    }));
  }, [countries]);

  return { countryCurrency };
};


export default useCurrency;
