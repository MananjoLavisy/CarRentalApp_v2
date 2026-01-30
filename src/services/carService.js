import { getAllCars, getCarById, searchCars } from '../database/models/Car';

export const fetchAllCars = async () => {
  try {
    return await getAllCars();
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

export const fetchCarDetails = async (carId) => {
  try {
    return await getCarById(carId);
  } catch (error) {
    console.error('Error fetching car details:', error);
    throw error;
  }
};

export const searchAvailableCars = async (filters) => {
  try {
    return await searchCars(filters);
  } catch (error) {
    console.error('Error searching cars:', error);
    throw error;
  }
};