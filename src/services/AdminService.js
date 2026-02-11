import { getAllReservations, updateReservationStatus } from '../database/models/Reservation';
import { getAllCars, updateCarStatus } from '../database/models/Car';
import { getAllUsers } from '../database/models/User';
import { getDBConnection } from '../database/db';

export const fetchAllReservations = async () => {
  try {
    return await getAllReservations();
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    throw error;
  }
};

export const approveReservation = async (reservationId, carId) => {
  try {
    await updateReservationStatus(reservationId, 'confirmée');
    await updateCarStatus(carId, 'louée');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const rejectReservation = async (reservationId, carId) => {
  try {
    await updateReservationStatus(reservationId, 'refusée');
    await updateCarStatus(carId, 'disponible');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchAllUsers = async () => {
  try {
    return await getAllUsers();
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  const db = await getDBConnection();

  try {
    const totalCars = await db.getFirstAsync('SELECT COUNT(*) as count FROM voitures');
    const availableCars = await db.getFirstAsync("SELECT COUNT(*) as count FROM voitures WHERE statut = 'disponible'");
    const totalUsers = await db.getFirstAsync("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    const pendingReservations = await db.getFirstAsync("SELECT COUNT(*) as count FROM reservations WHERE statut = 'en_attente'");
    const activeReservations = await db.getFirstAsync("SELECT COUNT(*) as count FROM reservations WHERE statut = 'confirmée'");
    const totalRevenue = await db.getFirstAsync("SELECT COALESCE(SUM(prix_total), 0) as total FROM reservations WHERE statut IN ('confirmée', 'terminée')");

    return {
      totalCars: totalCars.count,
      availableCars: availableCars.count,
      totalUsers: totalUsers.count,
      pendingReservations: pendingReservations.count,
      activeReservations: activeReservations.count,
      totalRevenue: totalRevenue.total,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
