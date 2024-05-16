import React, { useMemo } from 'react'
import { countries } from 'src/utilities/constants/countries';

const useCountryName = () => {
  const countryNames = useMemo(
    () => countries.map((country) => country.name),
    [countries]
  );
 return countryNames
}

export default useCountryName