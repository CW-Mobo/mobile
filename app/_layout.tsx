import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#b70a49' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#b70a49',
          drawerLabelStyle: { fontWeight: 'bold' },
        }}
      >
        <Drawer.Screen name="login" options={{ title: 'Login' }} />
        <Drawer.Screen name="cadastro" options={{ title: 'Cadastro' }} />
        <Drawer.Screen name="home" options={{ title: 'Home' }} />
        <Drawer.Screen name="curiosidades" options={{ title: 'Curiosidades' }} />
        <Drawer.Screen name="previsao-de-colheita" options={{ title: 'Previsão de Colheita' }} />
        <Drawer.Screen name="perfil" options={{ title: 'Perfil' }} />
        <Drawer.Screen
          name="controle"
          options={{
            title: 'Controle',
            headerShown: false,
          }}
        />
        { }
      </Drawer>
    </GestureHandlerRootView>
  );
}
