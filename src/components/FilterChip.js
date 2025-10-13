import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterChip = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  chipSelected: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },
  textSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FilterChip;
