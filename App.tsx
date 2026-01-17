import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CalculatorScreen from './src/screens/CalculatorScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CalculatorScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
