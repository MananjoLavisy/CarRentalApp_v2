export const generateTicketId = (reservationId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CAR-${reservationId}-${random}-${timestamp}`;
};

export const parseTicketId = (ticketId) => {
  try {
    const parts = ticketId.split('-');
    return {
      reservationId: parseInt(parts[1]),
      code: parts[2],
      timestamp: parseInt(parts[3])
    };
  } catch (error) {
    return null;
  }
};