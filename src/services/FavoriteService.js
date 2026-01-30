import { toggleFavorite, getFavorites, isFavorite } from '../database/models/Favorite';

export const toggleCarFavorite = async (userId, carId) => {
  try {
    const result = await toggleFavorite(userId, carId);
    return {
      success: true,
      isFavorite: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const fetchUserFavorites = async (userId) => {
  try {
    return await getFavorites(userId);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const checkIsFavorite = async (userId, carId) => {
  try {
    return await isFavorite(userId, carId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};