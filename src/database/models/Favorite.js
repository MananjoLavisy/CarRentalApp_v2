import { getDBConnection } from '../db';

export const toggleFavorite = async (userId, carId) => {
  const db = await getDBConnection();
  
  try {
    const existing = await db.getFirstAsync(
      'SELECT * FROM favoris WHERE user_id = ? AND voiture_id = ?',
      [userId, carId]
    );
    
    if (existing) {
      await db.runAsync(
        'DELETE FROM favoris WHERE user_id = ? AND voiture_id = ?',
        [userId, carId]
      );
      return false;
    } else {
      await db.runAsync(
        'INSERT INTO favoris (user_id, voiture_id) VALUES (?, ?)',
        [userId, carId]
      );
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const getFavorites = async (userId) => {
  const db = await getDBConnection();
  
  try {
    const favorites = await db.getAllAsync(
      `SELECT v.*, f.date_ajout 
       FROM voitures v
       INNER JOIN favoris f ON v.id = f.voiture_id
       WHERE f.user_id = ?
       ORDER BY f.date_ajout DESC`,
      [userId]
    );
    
    return favorites.map(car => ({
      ...car,
      photos: JSON.parse(car.photos)
    }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const isFavorite = async (userId, carId) => {
  const db = await getDBConnection();
  
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM favoris WHERE user_id = ? AND voiture_id = ?',
      [userId, carId]
    );
    
    return !!result;
  } catch (error) {
    console.error('Error checking favorite:', error);
    throw error;
  }
};