import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BookingCard from '../../components/BookingCard';
import { fetchUserReservations } from '../../services/BookingService';
import { useAuth } from '../../contexts/AuthContext';

const ReservationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, past

  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [])
  );

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchUserReservations(user.id);
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  const getFilteredReservations = () => {
    if (filter === 'all') return reservations;
    
    if (filter === 'active') {
      return reservations.filter(
        (r) => r.statut === 'confirmée' || r.statut === 'en_cours'
      );
    }
    
    if (filter === 'past') {
      return reservations.filter(
        (r) => r.statut === 'terminée' || r.statut === 'annulée'
      );
    }
    
    return reservations;
  };

  const filteredReservations = getFilteredReservations();

  const renderReservation = ({ item }) => (
    <BookingCard
      reservation={item}
      onPress={() =>
        navigation.navigate('ReservationDetails', { reservationId: item.id })
      }
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucune réservation</Text>
      <Text style={styles.emptySubtext}>
        {filter === 'active'
          ? 'Vous n\'avez pas de réservation en cours'
          : filter === 'past'
          ? 'Aucune réservation passée'
          : 'Commencez par louer une voiture'}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.browseButtonText}>Explorer les voitures</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Réservations</Text>
        <Text style={styles.headerSubtitle}>
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            Toutes ({reservations.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'active' && styles.filterButtonTextActive,
            ]}
          >
            Actives (
            {
              reservations.filter(
                (r) => r.statut === 'confirmée' || r.statut === 'en_cours'
              ).length
            }
            )
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
          onPress={() => setFilter('past')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'past' && styles.filterButtonTextActive,
            ]}
          >
            Passées (
            {
              reservations.filter(
                (r) => r.statut === 'terminée' || r.statut === 'annulée'
              ).length
            }
            )
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
          />
        }
      />
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReservationsScreen;