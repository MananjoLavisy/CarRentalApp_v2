import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { fetchCarDetails } from '../../services/carService';
import { checkIsFavorite, toggleCarFavorite } from '../../services/FavoriteService';
import { formatPriceSimple } from '../../utils/priceCalculator';
import { getCarImageSource } from '../../utils/imageHelpers';

const CarDetailsScreen = ({ route, navigation }) => {
  const { carId } = route.params;
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      const data = await fetchCarDetails(carId);
      setCar(data);

      if (user) {
        const favStatus = await checkIsFavorite(user.id, carId);
        setIsFavorite(favStatus);
      }
    } catch (error) {
      console.error('Error loading car details:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de la voiture');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter des favoris');
      return;
    }

    const result = await toggleCarFavorite(user.id, carId);
    if (result.success) {
      setIsFavorite(result.isFavorite);
    }
  };

  const handleRent = () => {
    if (!user) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour louer une voiture',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Auth') },
        ]
      );
      return;
    }

    navigation.navigate('BookingForm', { car });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!car) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Voiture introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={getCarImageSource(car.photos[0])} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#e74c3c' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View style={styles.titleLeft}>
              <Text style={styles.title}>
                {car.marque} {car.modele}
              </Text>
              <Text style={styles.subtitle}>
                {car.annee} • {car.type}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPriceSimple(car.prix_par_jour)}</Text>
              <Text style={styles.perDay}>/jour</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Icon name="account-group" size={24} color="#3498db" />
                <Text style={styles.featureLabel}>Places</Text>
                <Text style={styles.featureValue}>{car.nombre_places}</Text>
              </View>

              <View style={styles.featureItem}>
                <Icon name="car-shift-pattern" size={24} color="#3498db" />
                <Text style={styles.featureLabel}>Transmission</Text>
                <Text style={styles.featureValue}>{car.transmission}</Text>
              </View>

              <View style={styles.featureItem}>
                <Icon name="palette" size={24} color="#3498db" />
                <Text style={styles.featureLabel}>Couleur</Text>
                <Text style={styles.featureValue}>{car.couleur}</Text>
              </View>

              <View style={styles.featureItem}>
                <Icon name="calendar" size={24} color="#3498db" />
                <Text style={styles.featureLabel}>Année</Text>
                <Text style={styles.featureValue}>{car.annee}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <View style={styles.infoRow}>
              <Icon name="card-text-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>Immatriculation: {car.immatriculation}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="tag-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>Type: {car.type}</Text>
            </View>
          </View>

          {car.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{car.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilité</Text>
            <View style={styles.availabilityBadge}>
              <Icon name="check-circle" size={20} color="#27ae60" />
              <Text style={styles.availabilityText}>Disponible maintenant</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
          <Icon name="car" size={24} color="#fff" style={styles.rentIcon} />
          <Text style={styles.rentButtonText}>Louer maintenant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  perDay: {
    fontSize: 14,
    color: '#95a5a6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: '#5a6c7d',
    lineHeight: 24,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d5f4e6',
    padding: 12,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  rentButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(52, 152, 219, 0.3)',
    elevation: 4,
  },
  rentIcon: {
    marginRight: 8,
  },
  rentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CarDetailsScreen;