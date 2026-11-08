import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import BotonPrimario from '../components/BotonPrimario';
import { colors } from '../styles/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!usuario.trim() || !clave.trim()) {
      Alert.alert('Error', 'Completá todos los campos.');
      return;
    }

    const exito = await login(usuario, clave);
    if (!exito) {
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Coordinados</Text>
      <Text style={styles.subtitulo}>Iniciar Sesión</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Nombre de Usuario"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          value={clave}
          onChangeText={setClave}
          secureTextEntry
          style={styles.input}
        />
        <BotonPrimario label="Ingresar" onPress={handleLogin} color={colors.primary} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 15, alignItems: 'center' }}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>¿No tenés cuenta? Registrate acá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.background },
  titulo: { fontSize: 34, fontWeight: 'bold', textAlign: 'center', color: colors.primary, marginBottom: 5 },
  subtitulo: { fontSize: 18, textAlign: 'center', color: '#666', marginBottom: 25 },
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 10, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
});

export default LoginScreen;
