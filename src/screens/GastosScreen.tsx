import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Alert, Share, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth, Gasto } from '../context/AuthContext';
import BotonPrimario from '../components/BotonPrimario';
import { colors } from '../styles/colors';

const GastosScreen: React.FC = () => {
  const { gastos, setGastos, participantes, setParticipantes } = useAuth();
  
  const [nuevoParticipante, setNuevoParticipante] = useState('');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [pagadorActivo, setPagadorActivo] = useState<string>(participantes[0] || '');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const formatearMoneda = (val: number) => val.toFixed(2).replace('.', ',');
  const totalGastos = gastos.reduce((acc, current) => acc + current.monto, 0);
  const cantidadPersonas = participantes.length || 1;
  const porPersona = totalGastos / cantidadPersonas;

  const agregarParticipante = () => {
    const nombre = nuevoParticipante.trim();
    if (!nombre) {
      Alert.alert('Error', 'Escribí un nombre válido.');
      return;
    }
    if (participantes.includes(nombre)) {
      Alert.alert('Error', 'Ese participante ya fue agregado.');
      return;
    }

    const nuevaLista = [...participantes, nombre];
    setParticipantes(nuevaLista);
    if (!pagadorActivo) setPagadorActivo(nombre);
    setNuevoParticipante('');
  };

  const eliminarParticipante = (nombreABorrar: string) => {
    
            const nuevaLista = participantes.filter(p => p !== nombreABorrar);
            setParticipantes(nuevaLista);
            if (pagadorActivo === nombreABorrar) {
              setPagadorActivo(nuevaLista.length > 0 ? nuevaLista[0] : '');
            }
          };

  const guardarGasto = () => {
    const valorMonto = parseFloat(monto);
    if (!concepto.trim() || isNaN(valorMonto) || valorMonto <= 0) {
      Alert.alert('Error', 'Ingrese un concepto válido y un monto mayor a 0.');
      return;
    }
    if (!pagadorActivo) {
      Alert.alert('Error', 'Agregá al menos un participante para asignar quién pagó.');
      return;
    }

    if (editandoId) {
      setGastos(gastos.map(g => g.id === editandoId ? { ...g, concepto, monto: valorMonto, pagador: pagadorActivo } : g));
      setEditandoId(null);
    } else {
      const nuevoGasto: Gasto = { id: Date.now().toString(), pagador: pagadorActivo, monto: valorMonto, concepto };
      setGastos([...gastos, nuevoGasto]);
    }
    
    setConcepto('');
    setMonto('');
  };

  const iniciarEdicion = (gasto: Gasto) => {
    setConcepto(gasto.concepto);
    setMonto(gasto.monto.toString());
    setPagadorActivo(gasto.pagador);
    setEditandoId(gasto.id);
  };

  const eliminarGasto = (id: string) => {
    Alert.alert('Confirmar', '¿Seguro que querés borrar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => setGastos(gastos.filter(g => g.id !== id)) }
    ]);
  };

  const compartirResumen = async () => {
    if (gastos.length === 0) {
      Alert.alert('Aviso', 'No hay gastos para compartir.');
      return;
    }
    const listaNombres = participantes.join(', ') || 'el grupo';
    const mensaje = `*Resumen de Gastos*\n\nParticipantes: ${listaNombres}\nGastamos un total de $${formatearMoneda(totalGastos)}.\nSomos ${cantidadPersonas}, así que cada uno debe $${formatearMoneda(porPersona)}.\n`;
    try {
      await Share.share({ message: mensaje });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Gestión de Integrantes */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Integrantes</Text>
        <View style={styles.rowInput}>
          <TextInput
            value={nuevoParticipante}
            onChangeText={setNuevoParticipante}
            placeholder="Nombre del integrante..."
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <TouchableOpacity style={styles.addBtn} onPress={agregarParticipante}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Integrantes y borrado */}
        <View style={styles.chipsContainer}>
          {participantes.map(nombre => (
            <View key={nombre} style={styles.chip}>
              <Text style={styles.chipText}>{nombre}</Text>
              <TouchableOpacity onPress={() => eliminarParticipante(nombre)} style={styles.chipDelete}>
                <Text style={styles.chipDeleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Resumen de Cuentas */}
      <View style={styles.resumenBox}>
  <Text style={styles.resumenTexto}>
    Total: <Text style={styles.resumenMonto}>${formatearMoneda(totalGastos)}</Text>
  </Text>
  <Text style={styles.resumenTexto}>
    C/U ({cantidadPersonas}): <Text style={styles.resumenMonto}>${formatearMoneda(porPersona)}</Text>
  </Text>
</View>
      {/* Cargar Gasto */}
      <View style={styles.form}>
        <TextInput value={concepto} onChangeText={setConcepto} placeholder="Concepto (ej. Cena)" style={styles.input} />
        <TextInput value={monto} onChangeText={setMonto} placeholder="Monto ($)" keyboardType="numeric" style={styles.input} />
        
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>¿Quién pagó?</Text>
        {participantes.length === 0 ? (
          <Text style={{ fontStyle: 'italic', color: colors.danger, marginBottom: 10 }}>
            Agregá al menos un integrante arriba para elegir quién pagó.
          </Text>
        ) : (
          <View style={styles.selectorRow}>
            {participantes.map(nombre => (
              <TouchableOpacity 
                key={nombre} 
                style={[styles.pagadorBtn, pagadorActivo === nombre && styles.pagadorActivo]}
                onPress={() => setPagadorActivo(nombre)}
              >
                <Text style={{ color: pagadorActivo === nombre ? '#fff' : colors.text }}>{nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <BotonPrimario 
          label={editandoId ? "Actualizar Gasto" : "Agregar Gasto"} 
          onPress={guardarGasto} 
          color={editandoId ? colors.secondary : colors.primary} 
        />
      </View>

      {/* Lista de Gastos */}
      <FlatList
        data={gastos}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No hay gastos cargados para este usuario.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => iniciarEdicion(item)}>
              <Text style={styles.cardTitulo}>{item.concepto}</Text>
              <Text style={styles.cardDetalle}>Pagó: {item.pagador}</Text>
            </TouchableOpacity>

            <Text style={styles.cardMonto}>${formatearMoneda(item.monto)}</Text>

            <TouchableOpacity onPress={() => eliminarGasto(item.id)} style={styles.deleteBtn}>
              <Text style={{ color: colors.danger, fontWeight: 'bold', fontSize: 18 }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <BotonPrimario label="Compartir Balance" onPress={compartirResumen} color="#25D366" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  sectionBox: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 10, elevation: 1 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8, color: colors.text },
  rowInput: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: { backgroundColor: colors.secondary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e2e8f0', borderRadius: 16, paddingVertical: 4, paddingHorizontal: 10 },
  chipText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  chipDelete: { marginLeft: 6, padding: 2 },
  chipDeleteText: { fontSize: 12, color: colors.danger, fontWeight: 'bold' },
  resumenBox: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  resumenTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  resumenMonto: { fontSize: 18, fontWeight: 'bold' },
  form: { backgroundColor: colors.card, padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  pagadorBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, alignItems: 'center' },
  pagadorActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  card: { flexDirection: 'row', backgroundColor: colors.card, padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  cardTitulo: { fontSize: 16, fontWeight: 'bold' },
  cardDetalle: { color: '#666', marginTop: 4 },
  cardMonto: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginRight: 15 },
  deleteBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666', fontStyle: 'italic' },
});

export default GastosScreen;
