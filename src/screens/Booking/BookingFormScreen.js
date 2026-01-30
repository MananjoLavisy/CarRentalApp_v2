import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate, getDaysDifference, addDays } from '../../utils/dateHelpers';
import { calculateTotalPrice, formatPriceSimple } from '../../utils/priceCalculator';

const BookingFormScreen = ({ route, navigation }) => {
  const { car } = route.params;
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [formData, setFormData] = useState({
    startDate: today,
    endDate: tomorrow,
    showStartPicker: false,
    showEndPicker: false,
  });

  const numberOfDays = getDaysDifference(formData.startDate, formData.endDate);
  const totalPrice = calculateTotalPrice(car.prix_par_jour, numberOfDays);

  const handleStartDateChange = (event, selectedDate) => {
    setFormData(prev => ({
      ...prev,
      showStartPicker: Platform.OS === 'ios',
      startDate: selectedDate || prev.startDate,
    }));

    // Ajuster la date de fin si nécessaire
    if (selectedDate && selectedDate >= formData.endDate) {
      setFormData(prev => ({
        ...prev,
        endDate: addDays(selectedDate, 1),
      }));
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setFormData(prev => ({
      ...prev,
      showEndPicker: Platform.OS === 'ios',
      endDate: selectedDate || prev.endDate,
    }));
  };

  const handleContinue = () => {
    if (numberOfDays < 1) {
      Alert.alert('Erreur', 'La période de location doit être d\'au moins 1 jour');
      return;
    }

    navigation.navigate('Summary', {
      car,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
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
        <Text style={styles.headerTitle}>Réservation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.carInfo}>
          <Text style={styles.carTitle}>
            {car.marque} {car.modele}
          </Text>
          <Text style={styles.carSubtitle}>
            {formatPriceSimple(car.prix_par_jour)}/jour
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Période de location</Text>

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date de début</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setFormData(prev => ({ ...prev, showStartPicker: true }))}
            >
              <Icon name="calendar" size={20} color="#3498db" />
              <Text style={styles.dateText}>{formatDate(formData.startDate)}</Text>
            </TouchableOpacity>
          </View>

          {formData.showStartPicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display="default"
              minimumDate={today}
              onChange={handleStartDateChange}
            />
          )}

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date de fin</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setFormData(prev => ({ ...prev, showEndPicker: true }))}
            >
              <Icon name="calendar" size={20} color="#3498db" />
              <Text style={styles.dateText}>{formatDate(formData.endDate)}</Text>
            </TouchableOpacity>
          </View>

          {formData.showEndPicker && (
            <DateTimePicker
              value={formData.endDate}
              mode="date"
              display="default"
              minimumDate={addDays(formData.startDate, 1)}
              onChange={handleEndDateChange}
            />
          )}

          <View style={styles.durationContainer}>
            <Icon name="clock-outline" size={20} color="#7f8c8d" />
            <Text style={styles.durationText}>
              Durée: {numberOfDays} jour{numberOfDays > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif des prix</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {formatPriceSimple(car.prix_par_jour)} × {numberOfDays} jour{numberOfDays > 1 ? 's' : ''}
            </Text>
            <Text style={styles.priceValue}>{formatPriceSimple(totalPrice)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPriceSimple(totalPrice)}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Icon name="information-outline" size={20} color="#3498db" />
          <Text style={styles.infoText}>
            Vous pourrez confirmer votre réservation à l'étape suivante
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuer</Text>
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
  carInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  carTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  carSubtitle: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 4,
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
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  durationText: {
    fontSize: 16,
    color: '#1976d2',
    marginLeft: 8,
    fontWeight: '600',
  },  
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#7f8c8d', 
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
  },
  totalLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  totalValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },  
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 8,
  },
  });

export default BookingFormScreen;