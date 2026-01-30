import { 
  createReservation, 
  getReservationsByUserId, 
  getReservationById,
  checkCarAvailability,
  updateReservationStatus 
} from '../database/models/Reservation';
import { updateCarStatus } from '../database/models/Car';
import { generateTicketId } from '../utils/qrCodeGenerator';
import { getDaysDifference } from '../utils/dateHelpers';
import { calculateTotalPrice } from '../utils/priceCalculator';

export const createBooking = async (userId, carId, startDate, endDate, pricePerDay) => {
  try {
    // Vérifier disponibilité
    const isAvailable = await checkCarAvailability(carId, startDate, endDate);
    if (!isAvailable) {
      throw new Error('Cette voiture n\'est pas disponible pour ces dates');
    }
    
    // Calculer nombre de jours et prix total
    const numberOfDays = getDaysDifference(startDate, endDate);
    const totalPrice = calculateTotalPrice(pricePerDay, numberOfDays);
    
    // Générer ticket ID
    const ticketId = generateTicketId(Date.now());
    
    // Créer la réservation
    const reservation = await createReservation({
      user_id: userId,
      voiture_id: carId,
      date_debut: startDate,
      date_fin: endDate,
      nombre_jours: numberOfDays,
      prix_total: totalPrice,
      ticket_id: ticketId
    });
    
    // Mettre à jour le statut de la voiture
    await updateCarStatus(carId, 'louée');
    
    return {
      success: true,
      reservation
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const fetchUserReservations = async (userId) => {
  try {
    return await getReservationsByUserId(userId);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const fetchReservationDetails = async (reservationId) => {
  try {
    return await getReservationById(reservationId);
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    throw error;
  }
};

export const cancelReservation = async (reservationId, carId) => {
  try {
    await updateReservationStatus(reservationId, 'annulée');
    await updateCarStatus(carId, 'disponible');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const completeReservation = async (reservationId, carId) => {
  try {
    await updateReservationStatus(reservationId, 'terminée');
    await updateCarStatus(carId, 'disponible');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};