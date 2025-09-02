import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OriginalProblemScreen = ({ route }) => {
  const { year, month, grade } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        PDF 보기 기능은 현재 지원되지 않습니다.
      </Text>
      <Text style={styles.details}>
        선택된 문제: {year}년 {month}월 {grade}학년
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default OriginalProblemScreen;