# Coordinados - Gestor de Gastos de Viaje

Aplicación móvil desarrollada como Trabajo Práctico Integrador para organizar itinerarios y dividir gastos compartidos.

## Características
- **Navegación Combinada:** Uso de Bottom Tabs para las secciones principales y Stack Navigator anidado para el detalle del itinerario.
- **CRUD de Gastos:** Sistema en memoria para el alta, lectura, modificación y baja de gastos compartidos.
- **Estado Derivado:** Cálculo matemático en tiempo real del balance por persona sin utilizar estados redundantes.
- **Interacción Nativa:** Integración con la API `Share` de React Native para exportar el balance directamente a WhatsApp, y `Alert` para validaciones de formularios y confirmaciones de eliminación. Uso de expo-calendar para solicitar permisos de sistema en tiempo de ejecución y programar eventos con alarma nativa.
- **Autenticación y Persistencia por usuario:** Sistema de Registro e Inicio de Sesión gestionado con AuthContext. Utiliza @react-native-async-storage/async-storage para garantizar la persistencia local y el aislamiento de datos.

## Estructura de Carpetas
coordinados/
├── src/
│   ├── components/       # Componentes de UI (BotonPrimario.tsx)
│   ├── context/          # Estado global, autenticación y almacenamiento local (AuthContext.tsx)
│   ├── navigation/       # Configuración de navegadores Stack y Tabs (AppNavigator.tsx)
│   ├── screens/          # Pantallas principales (Login, Register, Cronograma, DetalleEvento, Gastos)
│   ├── styles/           # Paleta de colores y diseño (colors.ts)
│   └── types/            # Tipado estricto e interfaces de navegación (navigation.ts)
├── App.tsx               # Punto de entrada de la aplicación
└── package.json


## Instalación y Ejecución
1. Clonar el repositorio.
2. Instalar los paquetes node: `npm install`
3. Iniciar el servidor local de Expo: `npx expo start`
4. Escanear el código QR con la aplicación Expo Go en un dispositivo físico.

## Declaración de uso de herramientas
Para el desarrollo de este proyecto se utilizó asistencia de Inteligencia Artificial (Gemini) exclusivamente como herramienta de apoyo técnico. Su uso se limitó a:
 Asistencia en la integracion y manejo de permisos para módulos nativos
 Funciones auxiliares para montos con coma decimal
 Implementacion del AuthContext con almacenamiento en AsyncStorage 
