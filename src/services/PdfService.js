import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateTicketHTML, generateReceiptHTML } from '../utils/pdfTemplates';

export const exportTicketPDF = async ({ ticketId, car, startDate, endDate, numberOfDays, totalPrice, paymentMethod, user }) => {
  try {
    const html = generateTicketHTML({
      ticketId,
      car,
      startDate,
      endDate,
      numberOfDays,
      totalPrice,
      paymentMethod,
      user,
    });

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Ticket de réservation',
        UTI: 'com.adobe.pdf',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error exporting ticket PDF:', error);
    return { success: false, error: error.message };
  }
};

export const exportReceiptPDF = async ({ reservation, payment, user }) => {
  try {
    const html = generateReceiptHTML({ reservation, payment, user });

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Reçu de paiement',
        UTI: 'com.adobe.pdf',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error exporting receipt PDF:', error);
    return { success: false, error: error.message };
  }
};
