import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchBar = ({ value, onChangeText, onFilterPress, placeholder = 'Rechercher une voiture...' }) => {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={24} color="#95a5a6" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#95a5a6"
      />
      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <Icon name="tune" size={24} color="#3498db" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  filterButton: {
    padding: 8,
  },
});

export default SearchBar;