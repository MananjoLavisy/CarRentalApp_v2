import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { checkIsFavorite, toggleCarFavorite } from '../services/FavoriteService';
import { formatPriceSimple } from '../utils/priceCalculator';
import { getCarImageSource } from '../utils/imageHelpers';

const CarCard = ({ car, onPress, showFavorite = true }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (user && showFavorite) {
      loadFavoriteStatus();
    }
  }, [car.id, user]);
  
  const loadFavoriteStatus = async () => {
    const status = await checkIsFavorite(user.id, car.id);
    setIsFavorite(status);
  };
  
  const handleFavoritePress = async () => {
    if (!user) return;
    
    const result = await toggleCarFavorite(user.id, car.id);
    if (result.success) {
      setIsFavorite(result.isFavorite);
    }
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={getCarImageSource(car.photos[0])} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {showFavorite && user && (
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={handleFavoritePress}
        >
          <Icon 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? '#e74c3c' : '#fff'} 
          />
        </TouchableOpacity>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{car.marque} {car.modele}</Text>
        <Text style={styles.subtitle}>{car.annee} • {car.type}</Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Icon name="account-group" size={16} color="#666" />
            <Text style={styles.featureText}>{car.nombre_places} places</Text>
          </View>
          
          <View style={styles.feature}>
            <Icon name="car-shift-pattern" size={16} color="#666" />
            <Text style={styles.featureText}>{car.transmission}</Text>
          </View>
          
          <View style={styles.feature}>
            <Icon name="palette" size={16} color="#666" />
            <Text style={styles.featureText}>{car.couleur}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPriceSimple(car.prix_par_jour)}</Text>
          <Text style={styles.perDay}>/jour</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  perDay: {
    fontSize: 14,
    color: '#95a5a6',
    marginLeft: 4,
  },
});

export default CarCard;