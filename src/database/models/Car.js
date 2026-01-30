import { getDBConnection } from '../db';

export const getAllCars = async () => {
  const db = await getDBConnection();
  
  try {
    const cars = await db.getAllAsync(
      'SELECT * FROM voitures ORDER BY created_at DESC'
    );
    
    return cars.map(car => ({
      ...car,
      photos: JSON.parse(car.photos)
    }));
  } catch (error) {
    console.error('Error getting cars:', error);
    throw error;
  }
};

export const getCarById = async (id) => {
  const db = await getDBConnection();
  
  try {
    const car = await db.getFirstAsync(
      'SELECT * FROM voitures WHERE id = ?',
      [id]
    );
    
    if (car) {
      car.photos = JSON.parse(car.photos);
      return car;
    }
    return null;
  } catch (error) {
    console.error('Error getting car by ID:', error);
    throw error;
  }
};

export const searchCars = async (filters) => {
  const db = await getDBConnection();
  let query = 'SELECT * FROM voitures WHERE statut = "disponible"';
  const params = [];
  
  if (filters.type) {
    query += ' AND type = ?';
    params.push(filters.type);
  }
  
  if (filters.couleur) {
    query += ' AND couleur = ?';
    params.push(filters.couleur);
  }
  
  if (filters.nombre_places) {
    query += ' AND nombre_places >= ?';
    params.push(filters.nombre_places);
  }
  
  if (filters.transmission) {
    query += ' AND transmission = ?';
    params.push(filters.transmission);
  }
  
  if (filters.prix_max) {
    query += ' AND prix_par_jour <= ?';
    params.push(filters.prix_max);
  }
  
  if (filters.search) {
    query += ' AND (marque LIKE ? OR modele LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ' ORDER BY prix_par_jour ASC';
  
  try {
    const cars = await db.getAllAsync(query, params);
    
    return cars.map(car => ({
      ...car,
      photos: JSON.parse(car.photos)
    }));
  } catch (error) {
    console.error('Error searching cars:', error);
    throw error;
  }
};

export const updateCarStatus = async (carId, status) => {
  const db = await getDBConnection();
  
  try {
    await db.runAsync(
      'UPDATE voitures SET statut = ? WHERE id = ?',
      [status, carId]
    );
  } catch (error) {
    console.error('Error updating car status:', error);
    throw error;
  }
};