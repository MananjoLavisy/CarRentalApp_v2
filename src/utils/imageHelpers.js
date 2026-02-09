const CAR_PLACEHOLDER = require('../../assets/images/cars/car-placeholder.png');

export const getCarImageSource = (photoUrl) => {
  if (!photoUrl || photoUrl.startsWith('local:')) {
    return CAR_PLACEHOLDER;
  }
  return { uri: photoUrl };
};
