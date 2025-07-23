// 이 화면은 앱의 메인 홈 화면으로, 다양한 학습 메뉴(단어장, 해석, 모의고사 등)로 이동할 수 있는 네비게이션 역할을 합니다.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 학년 선택을 위한 배열
const grades = ['1', '2', '3'];
  const years = ['all', '2025', '2024', '2023', '2022', '2021'];

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
  const [recentTest, setRecentTest] = useState(null);

  useEffect(() => {
    const loadRecentTest = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('recentMockTest');
        if (jsonValue != null) {
          setRecentTest(JSON.parse(jsonValue));
        } else {
          setRecentTest(null);
        }
      } catch (e) {
        console.error('최근 학습 로딩 오류:', e);
        setRecentTest(null);
      }
    };

    loadRecentTest();
  }, []);
  const handleGoToRecent = () => {
    if (recentTest) {
      navigation.navigate('MockTestDetail', {
        year: recentTest.year,
        month: recentTest.month,
        grade: recentTest.grade,
      });
    } else {
      Alert.alert('알림', '최근 학습한 모의고사가 없습니다.');
    }
  };

  //뒤로가기(하드웨어/제스처) 시 무조건 앱 종료
  // useEffect(() => {
  //   const onBackPress = () => {
  //     BackHandler.exitApp();
  //     return true;
  //   };
  //   const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //   return () => subscription.remove();
  // }, []);

  // 선택된 학년 상태 (초기값: 선택 안함)
  const [selectedGrade, setSelectedGrade] = useState('1');
  const [selectedYear, setSelectedYear] = useState('all');

  // 선택된 학년과 연도에 따라 모의고사 리스트를 필터링한 결과
  const filteredTests = mockTests
    .filter((test) => {
      const matchGrade = selectedGrade === 'all' || String(test.grade) === selectedGrade;
      const matchYear = selectedYear === 'all' || String(test.year) === selectedYear;
      return matchGrade && matchYear;
    })
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.month - b.month;
    });


    
  // 안드로이드 하드웨어 백버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp(); // 홈 화면에서 뒤로가기 시 앱 종료
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );



  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>학년 선택</Text>
        <View style={styles.buttonGroup}>
          {grades.map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.button,
                String(selectedGrade) === String(grade) && styles.selectedButton,
              ]}
              onPress={() => setSelectedGrade(grade)}
            >
              <Text
                style={[
                  styles.buttonText,
                  String(selectedGrade) === String(grade) && styles.selectedButtonText,
                ]}
              >
                {grade}학년
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>연도 선택</Text>
        <View style={styles.yearButtonGroup}>
          {years.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                String(selectedYear) === String(year) && styles.selectedYearButton,
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Text
                style={[
                  styles.yearButtonText,
                  String(selectedYear) === String(year) && styles.selectedYearButtonText,
                ]}
              >
                {String(year) === 'all' ? '전체선택' : `${year}년`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>모의고사 목록</Text>
        <View style={styles.listContainer}>
          {filteredTests.map((test, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() =>
                navigation.navigate('MockTestDetail', {
                  year: test.year,
                  month: test.month,
                  grade: test.grade,
                })
              }
            >
              <Text style={styles.listItemText}>
                {test.year}년 {test.month}월 - {test.grade}학년 모의고사
              </Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.recentButton} onPress={handleGoToRecent}>
        <Text style={styles.recentButtonText}>최근학습</Text>
        <Text style={styles.arrow}>&gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cfcfcf',
  },
  selectedButton: {
    backgroundColor: '#78bfb8',
    borderColor: '#78bfb8',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  selectedButtonText: {
    color: '#fff',
  },
  yearButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cfcfcf',
    width: '45%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedYearButton: {
    borderColor: '#78bfb8',
  },
  yearButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedYearButtonText: {
    color: '#000', // Figma design shows black text for selected year
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  listItemText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
    color: '#cfcfcf',
  },
  recentButton: {
    backgroundColor: '#78bfb8',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  recentButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

