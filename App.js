import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import VocabularySelectRangeScreen from './screens/VocabularySelectRangeScreen';
import MockTestDetailScreen from './screens/MockTestDetailScreen';
import InterpretationScreen from './screens/InterpretationScreen';
import InterpretationSelectNumberScreen from './screens/InterpretationSelectNumberScreen';
import TopicScreen from './screens/TopicScreen';
import GrammarScreen from './screens/GrammarScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MockTestDetail" component={MockTestDetailScreen} />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
        <Stack.Screen name="VocabularySelectRange" component={VocabularySelectRangeScreen} />
        <Stack.Screen name="Interpretation" component={InterpretationScreen} />
        <Stack.Screen name="InterpretationSelectNumber" component={InterpretationSelectNumberScreen} />
        <Stack.Screen name="Grammar" component={GrammarScreen} />
        <Stack.Screen name="Topic" component={TopicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
