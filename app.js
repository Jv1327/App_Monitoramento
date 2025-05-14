import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import LoginScreen from './app';
import AdminScreen from './app/AdminScreen';
import DailyControlScreen from './app/DailyControlScreen';
import CadastroScreen from './app/CadastroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="DailyControl" component={DailyControlScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }