import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalize } from '../utils/normalize';

const ExplanationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>해설지 보기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: normalize(24) },
});

export default ExplanationScreen;
