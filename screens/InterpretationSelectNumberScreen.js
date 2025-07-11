
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InterpretationSelectNumber() {
  const navigation = useNavigation();

  const handleSelect = (number) => {
    navigation.navigate('Interpretation', { number });
  };

  const problemButtons = [];
  for (let i = 1; i <= 45; i++) {
    if (i === 41) {
      problemButtons.push("41-42");
      i = 42;
    } else if (i === 43) {
      problemButtons.push("43-45");
      break;
    } else {
      problemButtons.push(i.toString());
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>해석할 문제 번호를 선택하세요</Text>
      <View style={styles.grid}>
        {problemButtons.map(number => (
          <TouchableOpacity key={number} style={styles.button} onPress={() => handleSelect(number)}>
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    margin: 6,
    minWidth: 60,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16 }
});