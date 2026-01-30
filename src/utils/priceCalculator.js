export const calculateTotalPrice = (pricePerDay, numberOfDays) => {
  return pricePerDay * numberOfDays;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceSimple = (price) => {
  return `${price.toLocaleString('fr-MG')} Ar`;
};