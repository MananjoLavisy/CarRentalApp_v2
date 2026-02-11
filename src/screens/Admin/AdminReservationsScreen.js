import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAllReservations, approveReservation, rejectReservation } from '../../services/AdminService';
import { useFocusEffect } from '@react-navigation/native';
import { formatDate } from '../../utils/dateHelpers';
import { formatPriceSimple } from '../../utils/priceCalculator';

const statusConfig = {
  en_attente: { color: '#f39c12', icon: 'clock-outline', label: 'En attente' },
  confirmée: { color: '#27ae60', icon: 'check-circle', label: 'Confirmée' },
  annulée: { color: '#e74c3c', icon: 'close-circle', label: 'Annulée' },
  refusée: { color: '#c0392b', icon: 'cancel', label: 'Refusée' },
  terminée: { color: '#7f8c8d', icon: 'flag-checkered', label: 'Terminée' },
};

const AdminReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('tous');

  const loadReservations = async () => {
    try {
      const data = await fetchAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  const handleApprove = (reservation) => {
    Alert.alert(
      'Approuver la réservation',
      `Confirmer la réservation de ${reservation.user_prenom} ${reservation.user_nom} pour ${reservation.marque} ${reservation.modele} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Approuver',
          onPress: async () => {
            const result = await approveReservation(reservation.id, reservation.voiture_id);
            if (result.success) {
              loadReservations();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  };

  const handleReject = (reservation) => {
    Alert.alert(
      'Refuser la réservation',
      `Refuser la réservation de ${reservation.user_prenom} ${reservation.user_nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: async () => {
            const result = await rejectReservation(reservation.id, reservation.voiture_id);
            if (result.success) {
              loadReservations();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  };

  const filteredReservations = filter === 'tous'
    ? reservations
    : reservations.filter(r => r.statut === filter);

  const filters = [
    { key: 'tous', label: 'Tous' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'confirmée', label: 'Confirmées' },
    { key: 'terminée', label: 'Terminées' },
  ];

  const renderReservation = ({ item }) => {
    const status = statusConfig[item.statut] || statusConfig.en_attente;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.carInfo}>
            <Text style={styles.carName}>{item.marque} {item.modele}</Text>
            <Text style={styles.carPlate}>{item.immatriculation}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Icon name={status.icon} size={14} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.clientRow}>
          <Icon name="account" size={18} color="#7f8c8d" />
          <Text style={styles.clientText}>
            {item.user_prenom} {item.user_nom}
          </Text>
          {item.user_telephone && (
            <>
              <Icon name="phone" size={14} color="#bdc3c7" style={{ marginLeft: 12 }} />
              <Text style={styles.clientPhone}>{item.user_telephone}</Text>
            </>
          )}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar-range" size={16} color="#3498db" />
            <Text style={styles.detailText}>
              {formatDate(item.date_debut)} - {formatDate(item.date_fin)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={16} color="#3498db" />
            <Text style={styles.detailText}>{item.nombre_jours} jour{item.nombre_jours > 1 ? 's' : ''}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>{formatPriceSimple(item.prix_total)}</Text>
        </View>

        {item.statut === 'en_attente' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleReject(item)}
            >
              <Icon name="close" size={18} color="#e74c3c" />
              <Text style={styles.rejectText}>Refuser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleApprove(item)}
            >
              <Icon name="check" size={18} color="#fff" />
              <Text style={styles.approveText}>Approuver</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Réservations</Text>
        <Text style={styles.headerCount}>{filteredReservations.length} résultat{filteredReservations.length > 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredReservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={60} color="#bdc3c7" />
            <Text style={styles.emptyText}>Aucune réservation</Text>
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
  filterRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2c3e50',
  },
  filterChipText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  carInfo: {},
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  carPlate: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clientText: {
    fontSize: 15,
    color: '#2c3e50',
    marginLeft: 8,
    fontWeight: '500',
  },
  clientPhone: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#5a6c7d',
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdeaea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  rejectText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 6,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  approveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
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

export default AdminReservationsScreen;
