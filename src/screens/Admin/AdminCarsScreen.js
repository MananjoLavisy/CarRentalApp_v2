import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAllCars } from '../../services/carService';
import { useFocusEffect } from '@react-navigation/native';
import { getCarImageSource } from '../../utils/imageHelpers';
import { formatPriceSimple } from '../../utils/priceCalculator';

const statusColors = {
  disponible: '#27ae60',
  louée: '#3498db',
  maintenance: '#f39c12',
};

const AdminCarsScreen = () => {
  const [cars, setCars] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadCars = async () => {
    try {
      const data = await fetchAllCars();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCars();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCars();
    setRefreshing(false);
  };

  const renderCar = ({ item }) => {
    const statusColor = statusColors[item.statut] || '#7f8c8d';

    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Image
            source={getCarImageSource(item.photos[0])}
            style={styles.carImage}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.carName}>{item.marque} {item.modele}</Text>
            <Text style={styles.carYear}>{item.annee} - {item.type}</Text>
            <View style={styles.featuresRow}>
              <View style={styles.feature}>
                <Icon name="account-group" size={14} color="#7f8c8d" />
                <Text style={styles.featureText}>{item.nombre_places}</Text>
              </View>
              <View style={styles.feature}>
                <Icon name="car-shift-pattern" size={14} color="#7f8c8d" />
                <Text style={styles.featureText}>{item.transmission}</Text>
              </View>
              <View style={styles.feature}>
                <Icon name="palette" size={14} color="#7f8c8d" />
                <Text style={styles.featureText}>{item.couleur}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{formatPriceSimple(item.prix_par_jour)}/jour</Text>
          </View>
          <Text style={styles.plateText}>{item.immatriculation}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.statut}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voitures</Text>
        <Text style={styles.headerCount}>{cars.length} véhicule{cars.length > 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={cars}
        renderItem={renderCar}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="car-off" size={60} color="#bdc3c7" />
            <Text style={styles.emptyText}>Aucune voiture</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerCount: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 2,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  cardRow: {
    flexDirection: 'row',
  },
  carImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  carYear: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },
  plateText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
  },
});

export default AdminCarsScreen;
