import { getDBConnection } from '../database/db';

export const createPayment = async (paymentData) => {
  const db = await getDBConnection();
  const { reservation_id, montant, methode_paiement } = paymentData;
  
  try {
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const [result] = await db.executeSql(
      `INSERT INTO paiements (reservation_id, montant, methode_paiement, statut, reference_transaction) 
       VALUES (?, ?, ?, 'validé', ?)`,
      [reservation_id, montant, methode_paiement, reference]
    );
    
    return {
      success: true,
      payment: {
        id: result.insertId,
        reference,
        montant,
        methode_paiement,
        statut: 'validé'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getPaymentByReservation = async (reservationId) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM paiements WHERE reservation_id = ?',
      [reservationId]
    );
    
    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw error;
  }
};