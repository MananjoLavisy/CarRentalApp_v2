import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchReservationDetails, cancelReservation } from '../../services/BookingService';
import { getPaymentByReservation } from '../../services/PaymentService';
import { getExtensionHistory } from '../../services/ExtensionService';
import { formatDate, formatDateTime, getDaysUntil } from '../../utils/dateHelpers';
import { formatPriceSimple } from '../../utils/priceCalculator';
import { getCarImageSource } from '../../utils/imageHelpers';

const ReservationDetailsScreen = ({ route, navigation }) => {
  const { reservationId } = route.params;
  const [reservation, setReservation] = useState(null);
  const [payment, setPayment] = useState(null);
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservationDetails();
  }, [reservationId]);

  const loadReservationDetails = async () => {
    try {
      setLoading(true);
      const reservationData = await fetchReservationDetails(reservationId);
      setReservation(reservationData);

      const paymentData = await getPaymentByReservation(reservationId);
      setPayment(paymentData);

      const extensionData = await getExtensionHistory(reservationId);
      setExtensions(extensionData);
    } catch (error) {
      console.error('Error loading reservation details:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = () => {
    Alert.alert(
      'Annuler la réservation',
      'Êtes-vous sûr de vouloir annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelReservation(reservationId, reservation.voiture_id);
            if (result.success) {
              Alert.alert('Succès', 'Réservation annulée');
              navigation.goBack();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  };

  const handleExtendReservation = () => {
    navigation.navigate('ExtendBooking', { reservation });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmée':
        return '#3498db';
      case 'en_cours':
        return '#f39c12';
      case 'terminée':
        return '#27ae60';
      case 'annulée':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmée':
        return 'Confirmée';
      case 'en_cours':
        return 'En cours';
      case 'terminée':
        return 'Terminée';
      case 'annulée':
        return 'Annulée';
      default:
        return status;
    }
  };

  const canExtend = () => {
    return reservation && (reservation.statut === 'confirmée' || reservation.statut === 'en_cours');
  };

  const canCancel = () => {
    return reservation && reservation.statut === 'confirmée';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!reservation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Réservation introuvable</Text>
      </View>
    );
  }

  const daysUntilReturn = getDaysUntil(reservation.date_fin);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Statut */}
        <View style={styles.statusBanner} backgroundColor={getStatusColor(reservation.statut)}>
          <Icon name="information-outline" size={24} color="#fff" />
          <Text style={styles.statusText}>{getStatusText(reservation.statut)}</Text>
        </View>

        {/* Alerte si retour proche */}
        {daysUntilReturn >= 0 && daysUntilReturn <= 3 && reservation.statut !== 'terminée' && (
          <View style={styles.alertBox}>
            <Icon name="clock-alert-outline" size={24} color="#f39c12" />
            <Text style={styles.alertText}>
              {daysUntilReturn === 0
                ? 'Retour aujourd\'hui !'
                : `Retour dans ${daysUntilReturn} jour${daysUntilReturn > 1 ? 's' : ''}`}
            </Text>
          </View>
        )}

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Votre ticket</Text>
          <View style={styles.qrCodeWrapper}>
            <QRCode value={reservation.ticket_id} size={180} />
          </View>
          <Text style={styles.ticketId}>{reservation.ticket_id}</Text>
        </View>

        {/* Informations voiture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Véhicule</Text>
          <View style={styles.carCard}>
            <Image source={getCarImageSource(reservation.photos[0])} style={styles.carImage} />
            <View style={styles.carInfo}>
              <Text style={styles.carTitle}>
                {reservation.marque} {reservation.modele}
              </Text>
              <View style={styles.carDetail}>
                <Icon name="card-text-outline" size={16} color="#7f8c8d" />
                <Text style={styles.carDetailText}>{reservation.immatriculation}</Text>
              </View>
              <View style={styles.carDetail}>
                <Icon name="palette" size={16} color="#7f8c8d" />
                <Text style={styles.carDetailText}>{reservation.couleur}</Text>
              </View>
              <View style={styles.carDetail}>
                <Icon name="car-shift-pattern" size={16} color="#7f8c8d" />
                <Text style={styles.carDetailText}>{reservation.transmission}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Période de location</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Icon name="calendar-start" size={24} color="#3498db" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Début</Text>
                <Text style={styles.dateValue}>{formatDate(reservation.date_debut)}</Text>
              </View>
            </View>
            <Icon name="arrow-right" size={24} color="#bdc3c7" />
            <View style={styles.dateItem}>
              <Icon name="calendar-end" size={24} color="#3498db" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Fin</Text>
                <Text style={styles.dateValue}>{formatDate(reservation.date_fin)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.durationBox}>
            <Icon name="clock-outline" size={20} color="#fff" />
            <Text style={styles.durationText}>
              Durée: {reservation.nombre_jours} jour{reservation.nombre_jours > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Paiement */}
        {payment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paiement</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Montant total</Text>
              <Text style={styles.paymentValue}>{formatPriceSimple(reservation.prix_total)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Méthode</Text>
              <Text style={styles.paymentText}>
                {payment.methode_paiement === 'carte'
                  ? 'Carte Bancaire'
                  : payment.methode_paiement === 'mobile'
                  ? 'Mobile Money'
                  : 'Espèces'}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Référence</Text>
              <Text style={styles.paymentText}>{payment.reference_transaction}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Statut</Text>
              <View style={styles.paidBadge}>
                <Icon name="check-circle" size={16} color="#27ae60" />
                <Text style={styles.paidText}>Payé</Text>
              </View>
            </View>
          </View>
        )}

        {/* Extensions */}
        {extensions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historique des prolongations</Text>
            {extensions.map((ext, index) => (
              <View key={index} style={styles.extensionCard}>
                <View style={styles.extensionHeader}>
                  <Icon name="clock-plus-outline" size={20} color="#f39c12" />
                  <Text style={styles.extensionTitle}>
                    Prolongation #{index + 1}
                  </Text>
                </View>
                <Text style={styles.extensionDetail}>
                  De {formatDate(ext.ancienne_date_fin)} à {formatDate(ext.nouvelle_date_fin)}
                </Text>
                <Text style={styles.extensionDetail}>
                  +{ext.jours_supplementaires} jour{ext.jours_supplementaires > 1 ? 's' : ''} • {formatPriceSimple(ext.cout_supplementaire)}
                </Text>
                <Text style={styles.extensionDate}>
                  {formatDateTime(ext.date_extension)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoRow}>
            <Icon name="calendar-clock" size={20} color="#7f8c8d" />
            <Text style={styles.infoText}>
              Réservée le {formatDateTime(reservation.date_reservation)}
            </Text>
          </View>
          {reservation.extended === 1 && (
            <View style={styles.infoRow}>
              <Icon name="information-outline" size={20} color="#f39c12" />
              <Text style={styles.infoText}>Cette réservation a été prolongée</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.footer}>
        {canExtend() && (
          <TouchableOpacity
            style={styles.extendButton}
            onPress={handleExtendReservation}
          >
            <Icon name="clock-plus-outline" size={20} color="#fff" />
            <Text style={styles.extendButtonText}>Prolonger</Text>
          </TouchableOpacity>
        )}

        {canCancel() && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReservation}>
            <Icon name="close-circle-outline" size={20} color="#e74c3c" />
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#f39c12',
    marginLeft: 12,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 12,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  carCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  carImage: {
    width: 120,
    height: 120,
    backgroundColor: '#ecf0f1',
  },
  carInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  carTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  carDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  carDetailText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 6,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateInfo: {
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 2,
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  durationText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  paymentText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d5f4e6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
    marginLeft: 4,
  },
  extensionCard: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  extensionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  extensionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
    marginLeft: 8,
  },
  extensionDetail: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 4,
  },
  extensionDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#5a6c7d',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    gap: 12,
  },
  extendButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f39c12',
    borderRadius: 12,
    paddingVertical: 14,
  },
  extendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ReservationDetailsScreen;