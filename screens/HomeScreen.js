// 이 화면은 앱의 메인 홈 화면으로, 다양한 학습 메뉴(단어장, 해석, 모의고사 등)로 이동할 수 있는 네비게이션 역할을 합니다.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 파일 내 컨테이너 컴포넌트 정의
function HomeContainer(props) {
  const { style, scroll, children, ...rest } = props;
  if (scroll) {
    return (
      <ScrollView contentContainerStyle={style} {...rest}>
        {children}
      </ScrollView>
    );
  }
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

// 학년 선택을 위한 배열
const grades = [1, 2, 3];
// 연도 선택을 위한 배열
const years = [2025, 2024, 2023, 2022, 2021];

// 모의고사 정보 배열 (연도, 월, 학년)
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
  const navigation = useNavigation(); // 화면 이동을 위한 네비게이션 객체

  // 선택된 학년 상태 (초기값: 선택 안함)
  const [selectedGrade, setSelectedGrade] = useState(null);
  // 선택된 연도 상태 (초기값: 2025년만 선택)
  const [selectedYears, setSelectedYears] = useState([2025]);

  // 연도 버튼 클릭 시 해당 연도를 선택/해제하는 함수
  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year)); // 이미 선택된 연도면 해제
    } else {
      setSelectedYears([...selectedYears, year]); // 아니면 추가
    }
  };

  // 모든 연도가 선택되어 있는지 여부
  const isAllSelected = years.every((y) => selectedYears.includes(y));

  // '전체 선택' 버튼 클릭 시 모든 연도를 선택/해제하는 함수
  const handleToggleAllYears = () => {
    if (isAllSelected) {
      setSelectedYears([]); // 전체 해제
    } else {
      setSelectedYears([...years]); // 전체 선택
    }
  };

  // 선택된 학년과 연도에 따라 모의고사 리스트를 필터링한 결과
  const filteredTests = mockTests
    .filter((test) => {
      const matchGrade = selectedGrade === null || test.grade === selectedGrade; // 학년 조건
      const matchYear = selectedYears.includes(test.year); // 연도 조건
      return matchGrade && matchYear;
    })
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year; // 연도 내림차순 정렬
      return a.month - b.month; // 월 오름차순 정렬
    });

  return (
    <HomeContainer style={styles.container} scroll>
      {/* 학년 선택 영역 */}
      <Text style={styles.title}>학년 선택</Text>
      <HomeContainer style={styles.row}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade}
            style={[
              styles.selectButton,
              selectedGrade === grade && styles.selectedButton,
            ]}
            onPress={() => setSelectedGrade(grade)} // 학년 버튼 클릭 시 해당 학년 선택
          >
            <Text style={styles.buttonText}>{grade}학년</Text>
          </TouchableOpacity>
        ))}
      </HomeContainer>
      {/* 연도 선택 영역 */}
      <Text style={styles.title}>연도 선택</Text>
      <HomeContainer style={styles.row}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            isAllSelected && styles.selectedButton,
          ]}
          onPress={handleToggleAllYears} // 전체 선택/해제 버튼
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
            onPress={() => toggleYear(year)} // 연도 버튼 클릭 시 해당 연도 선택/해제
          >
            <Text style={styles.buttonText}>{year}년</Text>
          </TouchableOpacity>
        ))}
      </HomeContainer>
      {/* 필터링된 모의고사 리스트 영역 */}
      <Text style={styles.title}>모의고사 목록</Text>
      {selectedYears.length === 0 ? (
        <Text style={styles.emptyText}>연도를 선택해주세요.</Text> // 연도 미선택 시 안내문구
      ) : filteredTests.length === 0 ? (
        <Text style={styles.emptyText}>조건에 맞는 모의고사가 없습니다.</Text> // 조건에 맞는 모의고사가 없을 때
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
              }) // 모의고사 항목 클릭 시 상세화면으로 이동
            }
          >
            <Text>📘 {test.year}년 {test.month}월 - {test.grade}학년 모의고사</Text>
          </TouchableOpacity>
        ))
      )}
    </HomeContainer>
  );
}

// 스타일 정의
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