import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { RootTabParamList, CronogramaStackParamList, AuthStackParamList } from '../types/navigation';
import { AuthProvider, useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CronogramaScreen from '../screens/CronogramaScreen';
import DetalleEventoScreen from '../screens/DetalleEventoScreen';
import GastosScreen from '../screens/GastosScreen';

const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const Stack = createNativeStackNavigator<CronogramaStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const AuthNavigator = () => (
  <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
    <AuthStackNav.Screen name="Login" component={LoginScreen} />
    <AuthStackNav.Screen name="Register" component={RegisterScreen} />
  </AuthStackNav.Navigator>
);

const CronogramaStack = () => {
  const { logout, usuarioActual } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Text style={{ color: colors.danger, fontWeight: 'bold' }}>Salir ({usuarioActual})</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="ListaEventos" component={CronogramaScreen} options={{ title: 'Itinerario' }} />
      <Stack.Screen name="DetalleEvento" component={DetalleEventoScreen} options={{ title: 'Detalle' }} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { logout, usuarioActual } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';
          if (route.name === 'CronogramaTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'GastosTab') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="CronogramaTab" component={CronogramaStack} options={{ tabBarLabel: 'Itinerario' }} />
      <Tab.Screen 
        name="GastosTab" 
        component={GastosScreen} 
        options={{ 
          tabBarLabel: 'Gastos', 
          headerShown: true, 
          title: 'División de Gastos',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Text style={{ color: colors.danger, fontWeight: 'bold' }}>Salir ({usuarioActual})</Text>
            </TouchableOpacity>
          )
        }} 
      />
    </Tab.Navigator>
  );
};

const NavigationContent = () => {
  const { usuarioActual } = useAuth();
  return (
    <NavigationContainer>
      {usuarioActual ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const AppNavigator: React.FC = () => (
  <AuthProvider>
    <NavigationContent />
  </AuthProvider>
);

export default AppNavigator;
