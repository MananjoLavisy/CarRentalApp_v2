import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from '../../utils/dateHelpers';
import { formatPriceSimple } from '../../utils/priceCalculator';

const ConfirmationScreen = ({ route, navigation }) => {
  const {
    reservationId,
    ticketId,
    car,
    startDate,
    endDate,
    totalPrice,
    paymentMethod,
  } = route.params;

  const handleGoToReservations = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Reservations' } }],
    });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={80} color="#27ae60" />
        </View>

        <Text style={styles.title}>Réservation confirmée !</Text>
        <Text style={styles.subtitle}>
          Votre réservation a été enregistrée avec succès
        </Text>

        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Votre ticket de réservation</Text>
          <View style={styles.qrCodeWrapper}>
            <QRCode value={ticketId} size={200} />
          </View>
          <Text style={styles.ticketId}>{ticketId}</Text>
          <Text style={styles.qrNote}>
            Présentez ce QR code lors du retrait du véhicule
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Détails de la réservation</Text>

          <View style={styles.detailRow}>
            <Icon name="car" size={20} color="#7f8c8d" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Véhicule</Text>
              <Text style={styles.detailValue}>
                {car.marque} {car.modele}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar-start" size={20} color="#7f8c8d" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date de début</Text>
              <Text style={styles.detailValue}>{formatDate(startDate)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar-end" size={20} color="#7f8c8d" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date de fin</Text>
              <Text style={styles.detailValue}>{formatDate(endDate)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="cash" size={20} color="#7f8c8d" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Montant payé</Text>
              <Text style={styles.detailValue}>{formatPriceSimple(totalPrice)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="credit-card" size={20} color="#7f8c8d" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Méthode de paiement</Text>
              <Text style={styles.detailValue}>
                {paymentMethod === 'carte'
                  ? 'Carte Bancaire'
                  : paymentMethod === 'mobile'
                  ? 'Mobile Money'
                  : 'Paiement sur place'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Icon name="information-outline" size={24} color="#3498db" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Prochaines étapes</Text>
            <Text style={styles.infoText}>
              • Vous recevrez des rappels avant la date de retour{'\n'}
              • Présentez le QR code lors du retrait{'\n'}
              • N'oubliez pas votre permis de conduire{'\n'}
              • Vous pouvez prolonger la location si nécessaire
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToHome}
        >
          <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGoToReservations}
        >
          <Text style={styles.primaryButtonText}>Mes réservations</Text>
        </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingTop: 60,
  },

  successIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },

  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },

  qrCodeWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },

  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 16,
    letterSpacing: 1,
  },

  qrNote: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
  },

  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },

  detailIcon: {
    marginRight: 16,
  },

  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 22,
  },

  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;