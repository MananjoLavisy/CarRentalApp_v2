import { formatDate, formatDateTime } from './dateHelpers';

const formatPrice = (price) => {
  return `${Number(price).toLocaleString('fr-FR')} Ar`;
};

const getPaymentMethodLabel = (method) => {
  switch (method) {
    case 'carte': return 'Carte Bancaire';
    case 'mobile': return 'Mobile Money';
    case 'especes': return 'Paiement sur place';
    default: return method;
  }
};

const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica', 'Arial', sans-serif; color: #2c3e50; background: #fff; }
  .page { max-width: 600px; margin: 0 auto; padding: 40px 30px; }
  .header { text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; }
  .header h1 { font-size: 24px; color: #2c3e50; margin-bottom: 4px; }
  .header p { color: #7f8c8d; font-size: 13px; }
  .badge { display: inline-block; background: #3498db; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-top: 10px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #ecf0f1; padding-bottom: 6px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .row-label { color: #7f8c8d; font-size: 14px; }
  .row-value { font-weight: 600; font-size: 14px; color: #2c3e50; text-align: right; }
  .total-row { display: flex; justify-content: space-between; padding: 14px 0; border-top: 2px solid #2c3e50; margin-top: 8px; }
  .total-label { font-size: 16px; font-weight: bold; }
  .total-value { font-size: 20px; font-weight: bold; color: #3498db; }
  .qr-section { text-align: center; background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
  .qr-section .ticket-id { font-size: 16px; font-weight: bold; color: #3498db; letter-spacing: 2px; margin-top: 8px; }
  .qr-section .qr-note { font-size: 11px; color: #95a5a6; margin-top: 6px; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
  .footer p { font-size: 11px; color: #95a5a6; line-height: 1.6; }
  .highlight-box { background: #eaf6ff; border-left: 4px solid #3498db; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; }
  .highlight-box p { font-size: 13px; color: #2c3e50; }
`;

export const generateTicketHTML = ({ ticketId, car, startDate, endDate, numberOfDays, totalPrice, paymentMethod, user }) => {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
  <div class="page">
    <div class="header">
      <h1>CarRental Madagascar</h1>
      <p>Ticket de réservation</p>
      <div class="badge">CONFIRMÉ</div>
    </div>

    <div class="qr-section">
      <p style="font-size: 13px; color: #7f8c8d; margin-bottom: 8px;">Référence du ticket</p>
      <div class="ticket-id">${ticketId}</div>
      <p class="qr-note">Présentez cette référence lors du retrait du véhicule</p>
    </div>

    <div class="section">
      <div class="section-title">Véhicule</div>
      <div class="row">
        <span class="row-label">Voiture</span>
        <span class="row-value">${car.marque} ${car.modele}</span>
      </div>
      <div class="row">
        <span class="row-label">Année</span>
        <span class="row-value">${car.annee || '-'}</span>
      </div>
      <div class="row">
        <span class="row-label">Type</span>
        <span class="row-value">${car.type || '-'}</span>
      </div>
      <div class="row">
        <span class="row-label">Immatriculation</span>
        <span class="row-value">${car.immatriculation || '-'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Période de location</div>
      <div class="row">
        <span class="row-label">Date de début</span>
        <span class="row-value">${formatDate(startDate)}</span>
      </div>
      <div class="row">
        <span class="row-label">Date de fin</span>
        <span class="row-value">${formatDate(endDate)}</span>
      </div>
      <div class="row">
        <span class="row-label">Durée</span>
        <span class="row-value">${numberOfDays} jour${numberOfDays > 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Client</div>
      <div class="row">
        <span class="row-label">Nom</span>
        <span class="row-value">${user.prenom} ${user.nom}</span>
      </div>
      <div class="row">
        <span class="row-label">Email</span>
        <span class="row-value">${user.email}</span>
      </div>
      ${user.telephone ? `<div class="row"><span class="row-label">Téléphone</span><span class="row-value">${user.telephone}</span></div>` : ''}
      ${user.cin ? `<div class="row"><span class="row-label">CIN</span><span class="row-value">${user.cin}</span></div>` : ''}
    </div>

    <div class="section">
      <div class="section-title">Paiement</div>
      <div class="row">
        <span class="row-label">Prix par jour</span>
        <span class="row-value">${formatPrice(car.prix_par_jour)}</span>
      </div>
      <div class="row">
        <span class="row-label">Nombre de jours</span>
        <span class="row-value">× ${numberOfDays}</span>
      </div>
      <div class="row">
        <span class="row-label">Méthode</span>
        <span class="row-value">${getPaymentMethodLabel(paymentMethod)}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Total payé</span>
        <span class="total-value">${formatPrice(totalPrice)}</span>
      </div>
    </div>

    <div class="highlight-box">
      <p><strong>Rappels :</strong> Présentez ce ticket + votre permis de conduire + votre CIN lors du retrait. Le véhicule doit être retourné avec le même niveau de carburant.</p>
    </div>

    <div class="footer">
      <p>CarRental Madagascar<br>Document généré le ${formatDateTime(new Date())}<br>Ce document fait office de confirmation de réservation</p>
    </div>
  </div>
</body>
</html>`;
};

export const generateReceiptHTML = ({ reservation, payment, user }) => {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
  <div class="page">
    <div class="header">
      <h1>CarRental Madagascar</h1>
      <p>Reçu de paiement</p>
      <div class="badge" style="background: #27ae60;">PAYÉ</div>
    </div>

    <div class="qr-section">
      <p style="font-size: 13px; color: #7f8c8d; margin-bottom: 8px;">Référence transaction</p>
      <div class="ticket-id">${payment.reference_transaction}</div>
    </div>

    <div class="section">
      <div class="section-title">Détails du paiement</div>
      <div class="row">
        <span class="row-label">Date du paiement</span>
        <span class="row-value">${formatDateTime(payment.date_paiement)}</span>
      </div>
      <div class="row">
        <span class="row-label">Méthode</span>
        <span class="row-value">${getPaymentMethodLabel(payment.methode_paiement)}</span>
      </div>
      <div class="row">
        <span class="row-label">Statut</span>
        <span class="row-value" style="color: #27ae60;">✓ Validé</span>
      </div>
      <div class="total-row">
        <span class="total-label">Montant payé</span>
        <span class="total-value">${formatPrice(payment.montant)}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Réservation associée</div>
      <div class="row">
        <span class="row-label">Ticket</span>
        <span class="row-value">${reservation.ticket_id}</span>
      </div>
      <div class="row">
        <span class="row-label">Véhicule</span>
        <span class="row-value">${reservation.marque} ${reservation.modele}</span>
      </div>
      <div class="row">
        <span class="row-label">Période</span>
        <span class="row-value">${formatDate(reservation.date_debut)} - ${formatDate(reservation.date_fin)}</span>
      </div>
      <div class="row">
        <span class="row-label">Durée</span>
        <span class="row-value">${reservation.nombre_jours} jour${reservation.nombre_jours > 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Client</div>
      <div class="row">
        <span class="row-label">Nom</span>
        <span class="row-value">${user.prenom} ${user.nom}</span>
      </div>
      <div class="row">
        <span class="row-label">Email</span>
        <span class="row-value">${user.email}</span>
      </div>
      ${user.telephone ? `<div class="row"><span class="row-label">Téléphone</span><span class="row-value">${user.telephone}</span></div>` : ''}
    </div>

    <div class="footer">
      <p>CarRental Madagascar<br>Document généré le ${formatDateTime(new Date())}<br>Ce document fait office de reçu de paiement</p>
    </div>
  </div>
</body>
</html>`;
};
