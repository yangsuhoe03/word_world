import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>모의고사 회독 앱</Text>
      <Button
        title="2024년 3월 고3 모의고사"
        onPress={() => navigation.navigate('PartSelect')}
      />
    </View>
  );
}