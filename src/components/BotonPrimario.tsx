import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
};

const BotonPrimario: React.FC<Props> = ({ label, onPress, color = colors.primary, disabled = false }) => (
  <TouchableOpacity 
    style={[styles.btn, { backgroundColor: color }, disabled && styles.disabled]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BotonPrimario;
