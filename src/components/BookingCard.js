import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from '../utils/dateHelpers';
import { formatPriceSimple } from '../utils/priceCalculator';
import { getCarImageSource } from '../utils/imageHelpers';

const BookingCard = ({ reservation, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmée': return '#3498db';
      case 'en_cours': return '#f39c12';
      case 'terminée': return '#27ae60';
      case 'annulée': return '#e74c3c';
      default: return '#95a5a6';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmée': return 'Confirmée';
      case 'en_cours': return 'En cours';
      case 'terminée': return 'Terminée';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={getCarImageSource(reservation.photos[0])} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{reservation.marque} {reservation.modele}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.statut) }]}>
            <Text style={styles.statusText}>{getStatusText(reservation.statut)}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar-start" size={16} color="#666" />
            <Text style={styles.detailText}>Début: {formatDate(reservation.date_debut)}</Text>
          </View>
              
          <View style={styles.detailRow}>
            <Icon name="calendar-end" size={16} color="#666" />
            <Text style={styles.detailText}>Fin: {formatDate(reservation.date_fin)}</Text>
          </View>
              
          <View style={styles.detailRow}>
            <Icon name="calendar-clock" size={16} color="#666" />
            <Text style={styles.detailText}>{reservation.nombre_jours} jour(s)</Text>
          </View>
        </View>
            
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPriceSimple(reservation.prix_total)}</Text>
            {reservation.extended === 1 && (
              <View style={styles.extendedBadge}>
                  <Icon name="clock-plus-outline" size={14} color="#f39c12" />
                  <Text style={styles.extendedText}>Prolongée</Text>
              </View>
            )}
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
    height: 150,
    backgroundColor: '#f0f0f0',
  },

  content: {
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
    
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  details: {
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
  },

  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },

  extendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  extendedText: {
    fontSize: 12,
    color: '#f39c12',
    marginLeft: 4,
    fontWeight: '600',
  },
  
});
export default BookingCard;