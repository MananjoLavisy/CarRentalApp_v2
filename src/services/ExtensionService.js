import { getDBConnection } from '../database/db';
import { checkCarAvailability, getReservationById } from '../database/models/Reservation';
import { getDaysDifference } from '../utils/dateHelpers';

export const extendReservation = async (reservationId, newEndDate) => {
  const db = await getDBConnection();
  
  try {
    // Récupérer la réservation
    const reservation = await getReservationById(reservationId);
    if (!reservation) {
      throw new Error('Réservation introuvable');
    }
    
    if (reservation.statut === 'terminée' || reservation.statut === 'annulée') {
      throw new Error('Cette réservation ne peut pas être prolongée');
    }
    
    const oldEndDate = reservation.date_fin;
    const additionalDays = getDaysDifference(oldEndDate, newEndDate);
    
    if (additionalDays <= 0) {
      throw new Error('La nouvelle date doit être après la date de fin actuelle');
    }
    
    // Vérifier disponibilité
    const isAvailable = await checkCarAvailability(
      reservation.voiture_id,
      oldEndDate,
      newEndDate
    );
    
    if (!isAvailable) {
      throw new Error('La voiture n\'est pas disponible pour cette période');
    }
    
    // Calculer le coût (on récupère le prix par jour depuis les réservations)
    const pricePerDay = reservation.prix_total / reservation.nombre_jours;
    const additionalCost = pricePerDay * additionalDays;
    
    // Enregistrer l'extension
    await db.executeSql(
      `INSERT INTO extensions (reservation_id, ancienne_date_fin, nouvelle_date_fin, jours_supplementaires, cout_supplementaire)
       VALUES (?, ?, ?, ?, ?)`,
      [reservationId, oldEndDate, newEndDate, additionalDays, additionalCost]
    );
    
    // Mettre à jour la réservation
    const newTotalDays = reservation.nombre_jours + additionalDays;
    const newTotalPrice = reservation.prix_total + additionalCost;
    
    await db.executeSql(
      `UPDATE reservations 
       SET date_fin = ?, nombre_jours = ?, prix_total = ?, extended = 1
       WHERE id = ?`,
      [newEndDate, newTotalDays, newTotalPrice, reservationId]
    );
    
    return {
      success: true,
      additionalDays,
      additionalCost,
      newTotalPrice
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getExtensionHistory = async (reservationId) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM extensions WHERE reservation_id = ? ORDER BY date_extension DESC',
      [reservationId]
    );
    
    const extensions = [];
    for (let i = 0; i < result.rows.length; i++) {
      extensions.push(result.rows.item(i));
    }
    return extensions;
  } catch (error) {
    console.error('Error getting extension history:', error);
    throw error;
  }
};