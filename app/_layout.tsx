import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="completar-cadastro" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="home" />
        <Stack.Screen name="controle" />
        <Stack.Screen name="registros" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="curiosidades" />
        <Stack.Screen name="previsao-de-colheita" />
      </Stack>
    </GestureHandlerRootView>
  );
}
