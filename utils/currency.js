const getCurrencySymbol = (country) => {
    const currencySymbols = {
    "UnitedStates": "$",
    Canada: "$",
    "UnitedKingdom": "£",
    Australia: "$",
    Japan: "¥",
    China: "¥",
    Germany: "€",
    France: "€",
    Italy: "€",
    Spain: "€",
    Brazil: "R$",
    Mexico: "$",
    India: "₹",
    Russia: "₽",
    South Africa: "R",
    Nigeria: "₦",
    Egypt: "E£",
  };

  // Lookup currency symbol by country
  const currencySymbol = currencySymbols[country];

  if (!currencySymbol) {
    // Country not found in mapping
    throw new Error(`No currency symbol found for country '${country}'`);
  }

  return currencySymbol;
}

