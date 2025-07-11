// HomeScreen 컴포넌트
// - 학년/연도 선택 및 모의고사 목록 필터링, 상세 화면 이동을 담당합니다.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const grades = [1, 2, 3];
const years = [2025, 2024, 2023, 2022, 2021];

const mockTests = [
  { year: 2025, month: 3, grade: 1 },
  { year: 2025, month: 6, grade: 1 },
  { year: 2024, month: 3, grade: 1 },
  { year: 2024, month: 6, grade: 2 },
  { year: 2024, month: 9, grade: 2 },
  { year: 2023, month: 3, grade: 3 },
  { year: 2022, month: 6, grade: 3 },
  { year: 2021, month: 9, grade: 3 },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedYears, setSelectedYears] = useState([2025]); // 기본값: 2025년만 선택

  // toggleYear 함수
  // - 연도 버튼 클릭 시 해당 연도의 선택/해제를 토글합니다.
  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  const isAllSelected = years.every((y) => selectedYears.includes(y));

  // handleToggleAllYears 함수
  // - 전체 선택 버튼 클릭 시 모든 연도의 선택/해제를 토글합니다.
  const handleToggleAllYears = () => {
    if (isAllSelected) {
      setSelectedYears([]); // 전체 해제
    } else {
      setSelectedYears([...years]); // 전체 선택
    }
  };

  const filteredTests = mockTests
    .filter((test) => {
      const matchGrade = selectedGrade === null || test.grade === selectedGrade;
      const matchYear = selectedYears.includes(test.year);
      return matchGrade && matchYear;
    })
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.month - b.month;
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 학년 선택 */}
      <Text style={styles.title}>학년 선택</Text>
      <View style={styles.row}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade}
            style={[
              styles.selectButton,
              selectedGrade === grade && styles.selectedButton,
            ]}
            onPress={() => setSelectedGrade(grade)}
          >
            <Text style={styles.buttonText}>{grade}학년</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 연도 선택 */}
      <Text style={styles.title}>연도 선택</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            isAllSelected && styles.selectedButton,
          ]}
          onPress={handleToggleAllYears}
        >
          <Text style={styles.buttonText}>전체 선택</Text>
        </TouchableOpacity>

        {years.map((year) => (
          <TouchableOpacity
            key={year}
            style={[
              styles.selectButton,
              selectedYears.includes(year) && styles.selectedButton,
            ]}
            onPress={() => toggleYear(year)}
          >
            <Text style={styles.buttonText}>{year}년</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 필터링된 모의고사 리스트 */}
      <Text style={styles.title}>모의고사 목록</Text>
      {selectedYears.length === 0 ? (
        <Text style={styles.emptyText}>연도를 선택해주세요.</Text>
      ) : filteredTests.length === 0 ? (
        <Text style={styles.emptyText}>조건에 맞는 모의고사가 없습니다.</Text>
      ) : (
        filteredTests.map((test, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.testCard}
            onPress={() =>
              navigation.navigate('MockTestDetail', {
                year: test.year,
                month: test.month,
                grade: test.grade,
              })
            }
          >
            <Text>📘 {test.year}년 {test.month}월 - {test.grade}학년 모의고사</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  selectButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: { color: '#000' },
  testCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    width: '100%',
  },
  emptyText: { marginTop: 10, color: '#999' },
});