import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { createBooking } from '../../services/BookingService';
import { createPayment } from '../../services/PaymentService';
import { formatPriceSimple } from '../../utils/priceCalculator';
// import { scheduleReturnReminders } from '../../services/NotificationService';

const PaymentScreen = ({ route, navigation }) => {
  const { car, startDate, endDate, numberOfDays, totalPrice } = route.params;
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('carte');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'carte',
      name: 'Carte Bancaire',
      icon: 'credit-card',
      description: 'Visa, Mastercard',
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: 'cellphone',
      description: 'Orange Money, Mvola',
    },
    {
      id: 'especes',
      name: 'Paiement sur place',
      icon: 'cash',
      description: 'Espèces au retrait',
    },
  ];

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Créer la réservation
      const bookingResult = await createBooking(
        user.id,
        car.id,
        startDate,
        endDate,
        car.prix_par_jour
      );

      if (!bookingResult.success) {
        throw new Error(bookingResult.error);
      }

      const reservation = bookingResult.reservation;

      // Créer le paiement (simplifié)
      const paymentResult = await createPayment({
        reservation_id: reservation.id,
        montant: totalPrice,
        methode_paiement: selectedMethod,
      });

      if (!paymentResult.success) {
        throw new Error('Erreur lors du paiement');
      }

      // Planifier les notifications de rappel
      // scheduleReturnReminders({
      //   id: reservation.id,
      //   marque: car.marque,
      //   modele: car.modele,
      //   date_fin: endDate,
      // });

      setLoading(false);

      // Naviguer vers la confirmation
      navigation.replace('Confirmation', {
        reservationId: reservation.id,
        ticketId: reservation.ticket_id,
        car,
        startDate,
        endDate,
        totalPrice,
        paymentMethod: selectedMethod,
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Montant à payer</Text>
          <Text style={styles.amountValue}>{formatPriceSimple(totalPrice)}</Text>
          <Text style={styles.amountDetails}>
            Pour {numberOfDays} jour{numberOfDays > 1 ? 's' : ''} de location
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthode de paiement</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodIcon}>
                <Icon
                  name={method.icon}
                  size={28}
                  color={selectedMethod === method.id ? '#3498db' : '#7f8c8d'}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text
                  style={[
                    styles.methodName,
                    selectedMethod === method.id && styles.methodNameSelected,
                  ]}
                >
                  {method.name}
                </Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <View style={styles.radioContainer}>
                {selectedMethod === method.id ? (
                  <Icon name="radiobox-marked" size={24} color="#3498db" />
                ) : (
                  <Icon name="radiobox-blank" size={24} color="#bdc3c7" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Icon name="shield-check" size={24} color="#27ae60" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Paiement sécurisé</Text>
            <Text style={styles.infoText}>
              Vos informations de paiement sont sécurisées et cryptées
            </Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Icon name="information-outline" size={20} color="#f39c12" />
          <Text style={styles.noteText}>
            {selectedMethod === 'especes'
              ? 'Le paiement sera effectué lors du retrait du véhicule'
              : 'Le paiement sera traité immédiatement après confirmation'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check-circle" size={24} color="#fff" />
              <Text style={styles.confirmButtonText}>
                Confirmer le paiement
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  amountCard: {
    backgroundColor: '#3498db',
    padding: 30,
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  amountDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  methodNameSelected: {
    color: '#3498db',
  },
  methodDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  radioContainer: {
    marginLeft: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#d5f4e6',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#27ae60',
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#f39c12',
    marginLeft: 12,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(39, 174, 96, 0.3)',
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default PaymentScreen;