import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { normalize } from '../utils/normalize';
import { problemFileMap } from '../data/problemFileMap';

const TopIncorrectScreen = ({ route }) => {
  // Default values for testing if params are not passed
  const { year = 2025, month = 9, grade = 1 } = route.params || {};

  const key = `${year}_${String(month).padStart(2, '0')}_${grade}`;
  const pdfSource = problemFileMap[key];

  if (!pdfSource) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>PDF를 찾을 수 없습니다.</Text>
        <Text>{`키: ${key}`}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>1위 56%</Text>
        <View style={styles.pdfContainer}>
          <Pdf
            trustAllCerts={false}
            source={pdfSource}
            page={2}
            singlePage={true}
            style={styles.pdf}
          />
        </View>
      </View>

      <View style={styles.bottomContent}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.customButtonText}>답 확인</Text>
        </TouchableOpacity>
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.customButtonText}>이전문제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.customButtonText}>다음문제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width: deviceWidth } = Dimensions.get('window');
const pdfWidth = deviceWidth - 60; // Adjusted for padding
const pdfHeight = pdfWidth * 1.5; // 480:720 or 2:3 ratio

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  topContent: {
    width: '100%',
    alignItems: 'center',
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  pdfContainer: {
    borderRadius: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
    padding: 10,
  },
  pdf: {
    width: pdfWidth,
    height: pdfHeight,
  },
  actionButton: {
    backgroundColor: '#5FAAD9',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    width: '30%',
  },
  customButtonText: {
    color: 'white',
    fontSize: normalize(22),
    fontWeight: 'bold',
    marginVertical: 5,
  },
      navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
      },});

export default TopIncorrectScreen;