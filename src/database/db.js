import * as SQLite from 'expo-sqlite';

let db = null;

export const getDBConnection = async () => {
  if (db) {
    return db;
  }
  
  try {
    db = await SQLite.openDatabaseAsync('CarRentalDB.db');
    console.log('Database opened successfully');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    console.log('Database closed');
    db = null;
  }
};