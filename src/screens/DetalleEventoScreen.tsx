import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Calendar from 'expo-calendar/legacy';
import { CronogramaStackParamList } from '../types/navigation';
import BotonPrimario from '../components/BotonPrimario';
import { colors } from '../styles/colors';

const DetalleEventoScreen: React.FC = () => {
  const route = useRoute<RouteProp<CronogramaStackParamList, 'DetalleEvento'>>();
  const { titulo, fechaISO, direccion, descripcion } = route.params;

  const fechaEvento = new Date(fechaISO);

  const agendarRecordatorio = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

        if (defaultCalendar) {
          const fechaFin = new Date(fechaEvento.getTime() + 60 * 60 * 1000);

          await Calendar.createEventAsync(defaultCalendar.id, {
            title: titulo,
            startDate: fechaEvento,
            endDate: fechaFin,
            location: direccion,
            notes: descripcion,
            alarms: [{ relativeOffset: -15 }],
          });

          Alert.alert('¡Éxito!', `El evento fue agendado para el ${fechaEvento.toLocaleDateString()} a las ${fechaEvento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} con su alarma.`);
        } else {
          Alert.alert('Error', 'No se encontró un calendario configurado en el dispositivo.');
        }
      } else {
        Alert.alert('Permiso denegado', 'Se requieren permisos para acceder al calendario nativo.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el evento en el calendario.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Fecha: <Text style={styles.value}>{fechaEvento.toLocaleDateString()}</Text></Text>
        <Text style={styles.label}>Hora: <Text style={styles.value}>{fechaEvento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></Text>
        <Text style={styles.label}>Dirección: <Text style={styles.value}>{direccion}</Text></Text>
      </View>
      <Text style={styles.descripcion}>{descripcion}</Text>

      <View style={{ marginTop: 30 }}>
        <BotonPrimario
          label="🔔 Agendar Recordatorio / Alarma"
          onPress={agendarRecordatorio}
          color="#ea4335"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  titulo: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 20 },
  infoBox: { backgroundColor: colors.card, padding: 15, borderRadius: 8, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  value: { fontWeight: 'normal', color: colors.text },
  descripcion: { fontSize: 16, color: colors.text, lineHeight: 24 },
});

export default DetalleEventoScreen;
