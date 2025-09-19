import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalize } from '../utils/normalize';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>설정 창입니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  text: {
    fontSize: normalize(24),
  },
});

export default SettingsScreen;
