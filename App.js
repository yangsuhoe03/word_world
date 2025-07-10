import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import PartSelectScreen from './screens/PartSelectScreen';
import VocabularyScreen from './screens/VocabularyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PartSelect" component={PartSelectScreen} />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}