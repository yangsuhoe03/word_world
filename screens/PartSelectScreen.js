import React from 'react';
import { View, Button } from 'react-native';

export default function PartSelectScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Button title="1. 어휘" onPress={() => navigation.navigate('Vocabulary')} />
      <Button title="2. 해석" onPress={() => navigation.navigate('Interpretation')} />
      <Button title="3. 주제 외우기" onPress={() => navigation.navigate('Topic')} />
      <Button title="4. 어법 학습" onPress={() => navigation.navigate('Grammar')} />
    </View>
  );
}