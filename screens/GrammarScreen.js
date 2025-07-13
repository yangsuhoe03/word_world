import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GrammarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>문법 학습 화면이 준비 중입니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { fontSize: 18, textAlign: 'center' },
});
