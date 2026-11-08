import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CronogramaStackParamList } from '../types/navigation';
import { useAuth, Evento } from '../context/AuthContext';
import BotonPrimario from '../components/BotonPrimario';
import { colors } from '../styles/colors';

type Props = NativeStackScreenProps<CronogramaStackParamList, 'ListaEventos'>;

const CronogramaScreen: React.FC<Props> = ({ navigation }) => {
  const { eventos, setEventos } = useAuth();
  const [mostrarForm, setMostrarForm] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [fechaObj, setFechaObj] = useState(new Date());
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const agregarEvento = () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título del evento es obligatorio.');
      return;
    }

    const nuevoEvento: Evento = {
      id: Date.now().toString(),
      titulo,
      fechaISO: fechaObj.toISOString(),
      direccion: direccion.trim() || 'Sin ubicación especificada',
      descripcion: descripcion.trim() || 'Sin descripción adicional.',
    };

    setEventos([...eventos, nuevoEvento]);
    setTitulo('');
    setFechaObj(new Date());
    setDireccion('');
    setDescripcion('');
    setMostrarForm(false);
    Alert.alert('¡Éxito!', 'Evento agregado al itinerario.');
  };

  return (
    <View style={styles.container}>
      <BotonPrimario
        label={mostrarForm ? "Ocultar Formulario" : "+ Agregar Nuevo Evento"}
        onPress={() => setMostrarForm(!mostrarForm)}
        color={mostrarForm ? colors.danger : colors.secondary}
      />

      {mostrarForm && (
        <View style={styles.formContainer}>
          <TextInput 
            value={titulo} 
            onChangeText={setTitulo} 
            placeholder="Título" 
            style={styles.input} 
          />

          <Text style={styles.labelPicker}>Fecha y Hora del Evento:</Text>
          
          <View style={{ marginBottom: 12 }}>
            <View style={styles.pickerButtonsRow}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.pickerBtnText}>📅 {fechaObj.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.pickerBtnText}>⏰ {fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={fechaObj}
                mode="date"
                display="default"
                onValueChange={(event, date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (date) setFechaObj(date);
                }}
                onDismiss={() => setShowDatePicker(false)}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={fechaObj}
                mode="time"
                display="default"
                onValueChange={(event, date) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (date) setFechaObj(date);
                }}
                onDismiss={() => setShowTimePicker(false)}
              />
            )}
          </View>

          <TextInput 
            value={direccion} 
            onChangeText={setDireccion} 
            placeholder="Dirección / Lugar" 
            style={styles.input} 
          />
          
          <TextInput 
            value={descripcion} 
            onChangeText={setDescripcion} 
            placeholder="Notas / Descripción" 
            style={styles.input} 
            multiline 
          />
          
          <BotonPrimario label="Guardar Evento" onPress={agregarEvento} color={colors.primary} />
        </View>
      )}

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay eventos agendados para este usuario. Tocá el botón para agregar uno.</Text>
        }
        renderItem={({ item }) => {
          const dateObj = new Date(item.fechaISO);
          return (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('DetalleEvento', item)}
            >
              <Text style={styles.fechaHora}>
                {dateObj.toLocaleDateString()} - {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.direccion}>{item.direccion}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  formContainer: { backgroundColor: colors.card, padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  labelPicker: { fontWeight: 'bold', marginBottom: 6, color: colors.text },
  pickerButtonsRow: { flexDirection: 'row', gap: 10 },
  pickerBtn: { flex: 1, backgroundColor: '#e2e8f0', padding: 10, borderRadius: 8, alignItems: 'center' },
  pickerBtnText: { fontWeight: 'bold', color: colors.text },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 8, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: colors.primary },
  fechaHora: { color: colors.primary, fontWeight: 'bold', marginBottom: 4 },
  titulo: { fontSize: 18, fontWeight: '600', color: colors.text },
  direccion: { fontSize: 14, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 30, color: '#666', fontStyle: 'italic' },
});

export default CronogramaScreen;
