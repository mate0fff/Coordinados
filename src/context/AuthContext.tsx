import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Evento = {
  id: string;
  titulo: string;
  fechaISO: string;
  direccion: string;
  descripcion: string;
};

export type Gasto = {
  id: string;
  pagador: string;
  monto: number;
  concepto: string;
};

type AuthContextType = {
  usuarioActual: string | null;
  login: (usuario: string, clave: string) => Promise<boolean>;
  registro: (usuario: string, clave: string) => Promise<boolean>;
  logout: () => Promise<void>;
  eventos: Evento[];
  setEventos: (nuevosEventos: Evento[]) => Promise<void>;
  gastos: Gasto[];
  setGastos: (nuevosGastos: Gasto[]) => Promise<void>;
  participantes: string[];
  setParticipantes: (nuevosParticipantes: string[]) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState<string | null>(null);
  const [eventos, setEventosState] = useState<Evento[]>([]);
  const [gastos, setGastosState] = useState<Gasto[]>([]);
  const [participantes, setParticipantesState] = useState<string[]>([]);

  useEffect(() => {
    const cargarSesionPrevias = async () => {
      try {
        const userSesion = await AsyncStorage.getItem('@session_user');
        if (userSesion) {
          setUsuarioActual(userSesion);
          await cargarDatosUsuario(userSesion);
        }
      } catch (e) {
        console.error('Error al cargar sesión activa', e);
      }
    };
    cargarSesionPrevias();
  }, []);

  const cargarDatosUsuario = async (username: string) => {
    try {
      const dataEvs = await AsyncStorage.getItem(`@eventos_${username}`);
      const dataGst = await AsyncStorage.getItem(`@gastos_${username}`);
      const dataPts = await AsyncStorage.getItem(`@participantes_${username}`);

      setEventosState(dataEvs ? JSON.parse(dataEvs) : []);
      setGastosState(dataGst ? JSON.parse(dataGst) : []);
      setParticipantesState(dataPts ? JSON.parse(dataPts) : [username]);
    } catch (e) {
      console.error('Error al cargar datos del usuario', e);
    }
  };

  const registro = async (usuario: string, clave: string): Promise<boolean> => {
    const userClean = usuario.trim().toLowerCase();
    if (!userClean || !clave.trim()) return false;

    try {
      const usersRaw = await AsyncStorage.getItem('@users_db');
      const users = usersRaw ? JSON.parse(usersRaw) : {};

      if (users[userClean]) {
        return false; // El usuario ya existe
      }

      users[userClean] = clave;
      await AsyncStorage.setItem('@users_db', JSON.stringify(users));

      await AsyncStorage.setItem('@session_user', userClean);
      setUsuarioActual(userClean);
      await cargarDatosUsuario(userClean);
      return true;
    } catch (e) {
      console.error('Error en registro', e);
      return false;
    }
  };

  const login = async (usuario: string, clave: string): Promise<boolean> => {
    const userClean = usuario.trim().toLowerCase();
    try {
      const usersRaw = await AsyncStorage.getItem('@users_db');
      const users = usersRaw ? JSON.parse(usersRaw) : {};

      if (users[userClean] && users[userClean] === clave) {
        await AsyncStorage.setItem('@session_user', userClean);
        setUsuarioActual(userClean);
        await cargarDatosUsuario(userClean);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error en login', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@session_user');
      setUsuarioActual(null);
      setEventosState([]);
      setGastosState([]);
      setParticipantesState([]);
    } catch (e) {
      console.error('Error en logout', e);
    }
  };

  const setEventos = async (nuevosEventos: Evento[]) => {
    setEventosState(nuevosEventos);
    if (usuarioActual) {
      await AsyncStorage.setItem(`@eventos_${usuarioActual}`, JSON.stringify(nuevosEventos));
    }
  };

  const setGastos = async (nuevosGastos: Gasto[]) => {
    setGastosState(nuevosGastos);
    if (usuarioActual) {
      await AsyncStorage.setItem(`@gastos_${usuarioActual}`, JSON.stringify(nuevosGastos));
    }
  };

  const setParticipantes = async (nuevosParticipantes: string[]) => {
    setParticipantesState(nuevosParticipantes);
    if (usuarioActual) {
      await AsyncStorage.setItem(`@participantes_${usuarioActual}`, JSON.stringify(nuevosParticipantes));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        login,
        registro,
        logout,
        eventos,
        setEventos,
        gastos,
        setGastos,
        participantes,
        setParticipantes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
