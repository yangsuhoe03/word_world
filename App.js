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
import SettingsScreen from './screens/SettingsScreen';
import OriginalProblemScreen from './screens/OriginalProblemScreen';
import ExplanationScreen from './screens/ExplanationScreen';
import TopIncorrectScreen from './screens/TopIncorrectScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MockTestDetail" component={MockTestDetailScreen}  />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
        <Stack.Screen name="VocabularySelectRange" component={VocabularySelectRangeScreen} />
        <Stack.Screen name="Interpretation" component={InterpretationScreen} />
        <Stack.Screen name="InterpretationSelectNumber" component={InterpretationSelectNumberScreen} />
        <Stack.Screen name="Topic" component={TopicScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="OriginalProblem" component={OriginalProblemScreen} />
        <Stack.Screen name="Explanation" component={ExplanationScreen} />
        <Stack.Screen 
          name="TopIncorrect" 
          component={TopIncorrectScreen} 
          options={({ route }) => ({ 
            title: `${route.params.year}년 ${route.params.month}월 ${route.params.grade}학년 모의고사` 
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}