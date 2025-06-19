import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importamos los íconos

import LoginScreen from './frontend/.expo/src/screens/LoginScreenRol'; // Pantalla de Login
import HomeScreen from './frontend/.expo/src/screens/HomeScreen';  // Pantalla dentro de las tabs
import SettingsScreen from './frontend/.expo/src/screens/SettingsScren';  // Pantalla dentro de las tabs
import ProfileScreen from './frontend/.expo/src/screens/PerfilDeUsuario';  // Pantalla dentro de las tabs
import Calendar from './frontend/.expo/src/screens/Calendario';  
import DetallesCurso from './frontend/.expo/src/screens/DetallesCursos';  

import HomeScreenStudent from './frontend/.expo/src/screens/HomeScreenStudent'; 
import DetallesCursoStudent from './frontend/.expo/src/screens/DetallesCursoStudent';  
import UserScreen from './frontend/.expo/src/screens/UserScreen';  
import ForoScreen from './frontend/.expo/src/screens/ForoScreen';
import TareaScreen from './frontend/.expo/src/screens/TareaScreen';
import TareasScreenStudent from './frontend/.expo/src/screens/TareaScreenStudent'; 
import AboutScreen from './frontend/.expo/src/screens/AboutScreen';
import PrivacyScreen from './frontend/.expo/src/screens/PrivacySreen';

import { I18nextProvider } from 'react-i18next';
import i18n from './frontend/.expo/src/config/i18n'; // Importa la configuración de i18next

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator después del login
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={Calendar} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function StudentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreenStudent} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={Calendar} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />  
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Usuario" 
        component={UserScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={Calendar} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator que incluye Login y Tabs
function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Pantalla de Login */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="DetallesCursos" component={DetallesCurso} />
      <Stack.Screen name="DetallesCursosEstudiante" component={DetallesCursoStudent}/>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Pantalla con Tabs (mostrada después de iniciar sesión) */}
      <Stack.Screen name="MainTabs" component={MyTabs} options={{ headerShown: false }} />
      <Stack.Screen name="StudentTabs" component={StudentTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
     
      <Stack.Screen name="TareaScreen" component={TareaScreen} />
      <Stack.Screen name="TareasScreenStudent" component={TareasScreenStudent} />
      <Stack.Screen name="ForoScreen" component={ForoScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}> 
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </I18nextProvider>
  ); 
}
