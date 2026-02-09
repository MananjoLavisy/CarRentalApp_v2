import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from '../../utils/dateHelpers';
import { formatPriceSimple } from '../../utils/priceCalculator';
import { getCarImageSource } from '../../utils/imageHelpers';
import { useAuth } from '../../contexts/AuthContext';

const SummaryScreen = ({ route, navigation }) => {
  const { car, startDate, endDate, numberOfDays, totalPrice } = route.params;
  const { user } = useAuth();

  const handleProceedToPayment = () => {
    navigation.navigate('Payment', {
      car,
      startDate,
      endDate,
      numberOfDays,
      totalPrice,
    });
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
        <Text style={styles.headerTitle}>Récapitulatif</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Informations voiture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voiture sélectionnée</Text>
          <View style={styles.carCard}>
            <Image source={getCarImageSource(car.photos[0])} style={styles.carImage} />
            <View style={styles.carInfo}>
              <Text style={styles.carTitle}>
                {car.marque} {car.modele}
              </Text>
              <View style={styles.carFeature}>
                <Icon name="account-group" size={16} color="#7f8c8d" />
                <Text style={styles.carFeatureText}>{car.nombre_places} places</Text>
              </View>
              <View style={styles.carFeature}>
                <Icon name="car-shift-pattern" size={16} color="#7f8c8d" />
                <Text style={styles.carFeatureText}>{car.transmission}</Text>
              </View>
              <View style={styles.carFeature}>
                <Icon name="palette" size={16} color="#7f8c8d" />
                <Text style={styles.carFeatureText}>{car.couleur}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Période de location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Période de location</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Icon name="calendar-start" size={24} color="#3498db" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Début</Text>
                <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
              </View>
            </View>
            <Icon name="arrow-right" size={24} color="#bdc3c7" />
            <View style={styles.dateItem}>
              <Icon name="calendar-end" size={24} color="#3498db" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Fin</Text>
                <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.durationBox}>
            <Icon name="clock-outline" size={20} color="#fff" />
            <Text style={styles.durationText}>
              Durée totale: {numberOfDays} jour{numberOfDays > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vos informations</Text>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#7f8c8d" />
            <Text style={styles.infoText}>
              {user.prenom} {user.nom}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#7f8c8d" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          {user.telephone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>{user.telephone}</Text>
            </View>
          )}
          {user.cin && (
            <View style={styles.infoRow}>
              <Icon name="card-account-details" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>CIN: {user.cin}</Text>
            </View>
          )}
        </View>

        {/* Détail des prix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail des prix</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Prix par jour</Text>
            <Text style={styles.priceValue}>{formatPriceSimple(car.prix_par_jour)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Nombre de jours</Text>
            <Text style={styles.priceValue}>× {numberOfDays}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text style={styles.totalValue}>{formatPriceSimple(totalPrice)}</Text>
          </View>
        </View>

        {/* Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions importantes</Text>
          <View style={styles.conditionItem}>
            <Icon name="check-circle" size={20} color="#27ae60" />
            <Text style={styles.conditionText}>
              Le véhicule doit être retourné à la date indiquée
            </Text>
          </View>
          <View style={styles.conditionItem}>
            <Icon name="check-circle" size={20} color="#27ae60" />
            <Text style={styles.conditionText}>
              Carburant non inclus dans le prix
            </Text>
          </View>
          <View style={styles.conditionItem}>
            <Icon name="check-circle" size={20} color="#27ae60" />
            <Text style={styles.conditionText}>
              Assurance de base incluse
            </Text>
          </View>
          <View style={styles.conditionItem}>
            <Icon name="check-circle" size={20} color="#27ae60" />
            <Text style={styles.conditionText}>
              Permis de conduire valide requis
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalValue}>{formatPriceSimple(totalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.paymentButtonText}>Procéder au paiement</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
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
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
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
  carFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  carFeatureText: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#5a6c7d',
  },
  priceValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conditionText: {
    flex: 1,
    fontSize: 14,
    color: '#5a6c7d',
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  footerTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  footerTotalLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  footerTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  paymentButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(39, 174, 96, 0.3)',
    elevation: 4,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default SummaryScreen;