import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterModal = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const types = ['Berline', 'SUV', 'Compact', 'Pick-up'];
  const transmissions = ['Automatique', 'Manuelle'];
  const seats = [4, 5, 7];
  const colors = ['Blanc', 'Noir', 'Gris', 'Rouge', 'Bleu'];
  
  const handleApply = () => {
    onApply(filters);
    onClose();
  };
  
  const handleReset = () => {
    setFilters({});
  };
  
  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtres</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            {/* Type de voiture */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de voiture</Text>
              <View style={styles.options}>
                {types.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.option,
                      filters.type === type && styles.optionSelected
                    ]}
                    onPress={() => toggleFilter('type', type)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.type === type && styles.optionTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Transmission */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transmission</Text>
              <View style={styles.options}>
                {transmissions.map(transmission => (
                  <TouchableOpacity
                    key={transmission}
                    style={[
                      styles.option,
                      filters.transmission === transmission && styles.optionSelected
                    ]}
                    onPress={() => toggleFilter('transmission', transmission)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.transmission === transmission && styles.optionTextSelected
                    ]}>
                      {transmission}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Nombre de places */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nombre de places</Text>
              <View style={styles.options}>
                {seats.map(seat => (
                  <TouchableOpacity
                    key={seat}
                    style={[
                      styles.option,
                      filters.nombre_places === seat && styles.optionSelected
                    ]}
                    onPress={() => toggleFilter('nombre_places', seat)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.nombre_places === seat && styles.optionTextSelected
                    ]}>
                      {seat}+ places
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Couleur */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Couleur</Text>
              <View style={styles.options}>
                {colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.option,
                      filters.couleur === color && styles.optionSelected
                    ]}
                    onPress={() => toggleFilter('couleur', color)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.couleur === color && styles.optionTextSelected
                    ]}>
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]} 
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.applyButton]} 
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  optionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#ecf0f1',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  applyButton: {
    backgroundColor: '#3498db',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FilterModal;