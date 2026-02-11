import { getDBConnection } from '../db';

export const createReservation = async (reservationData) => {
  const db = await getDBConnection();
  const { user_id, voiture_id, date_debut, date_fin, nombre_jours, prix_total, ticket_id } = reservationData;

  try {
    const result = await db.runAsync(
      `INSERT INTO reservations (user_id, voiture_id, date_debut, date_fin, nombre_jours, prix_total, ticket_id, statut)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      [user_id, voiture_id, date_debut, date_fin, nombre_jours, prix_total, ticket_id]
    );

    return { id: result.lastInsertRowId, ...reservationData };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const getAllReservations = async () => {
  const db = await getDBConnection();

  try {
    const reservations = await db.getAllAsync(
      `SELECT r.*, v.marque, v.modele, v.photos, v.immatriculation, v.type,
              u.nom as user_nom, u.prenom as user_prenom, u.email as user_email, u.telephone as user_telephone
       FROM reservations r
       INNER JOIN voitures v ON r.voiture_id = v.id
       INNER JOIN users u ON r.user_id = u.id
       ORDER BY r.date_reservation DESC`
    );

    return reservations.map(reservation => ({
      ...reservation,
      photos: JSON.parse(reservation.photos)
    }));
  } catch (error) {
    console.error('Error getting all reservations:', error);
    throw error;
  }
};

export const getReservationsByUserId = async (userId) => {
  const db = await getDBConnection();
  
  try {
    const reservations = await db.getAllAsync(
      `SELECT r.*, v.marque, v.modele, v.photos, v.immatriculation, v.type
       FROM reservations r
       INNER JOIN voitures v ON r.voiture_id = v.id
       WHERE r.user_id = ?
       ORDER BY r.date_reservation DESC`,
      [userId]
    );
    
    return reservations.map(reservation => ({
      ...reservation,
      photos: JSON.parse(reservation.photos)
    }));
  } catch (error) {
    console.error('Error getting reservations:', error);
    throw error;
  }
};

export const getReservationById = async (id) => {
  const db = await getDBConnection();
  
  try {
    const reservation = await db.getFirstAsync(
      `SELECT r.*, v.marque, v.modele, v.photos, v.immatriculation, v.type, v.couleur, v.transmission
       FROM reservations r
       INNER JOIN voitures v ON r.voiture_id = v.id
       WHERE r.id = ?`,
      [id]
    );
    
    if (reservation) {
      reservation.photos = JSON.parse(reservation.photos);
      return reservation;
    }
    return null;
  } catch (error) {
    console.error('Error getting reservation by ID:', error);
    throw error;
  }
};

export const updateReservationStatus = async (id, status) => {
  const db = await getDBConnection();
  
  try {
    await db.runAsync(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      [status, id]
    );
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};

export const checkCarAvailability = async (carId, startDate, endDate) => {
  const db = await getDBConnection();
  
  try {
    const result = await db.getFirstAsync(
      `SELECT COUNT(*) as count FROM reservations 
       WHERE voiture_id = ? 
       AND statut IN ('en_attente', 'confirmée', 'en_cours')
       AND (
         (date_debut <= ? AND date_fin >= ?) OR
         (date_debut <= ? AND date_fin >= ?) OR
         (date_debut >= ? AND date_fin <= ?)
       )`,
      [carId, startDate, startDate, endDate, endDate, startDate, endDate]
    );
    
    return result.count === 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};