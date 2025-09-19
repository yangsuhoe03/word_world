// 이 화면은 앱의 메인 홈 화면으로, 다양한 학습 메뉴(단어장, 해석, 모의고사 등)로 이동할 수 있는 네비게이션 역할을 합니다.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert, Image, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '../utils/normalize';
import { problemFileMap } from '../data/problemFileMap';

// 학년 선택을 위한 배열
const grades = ['1', '2', '3'];
const years = ['all', '2025', '2024', '2023', '2022', '2021'];
const plusIcon = require('../assets/icons/plus.png');
const checkIcon = require('../assets/icons/check.png');

const mockTests = Object.keys(problemFileMap).map(
  key => {
    const [year, month, grade] = key.split('_').map(
      Number);
    return { year, month, grade };
  });

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
  const [selectedYears, setSelectedYears] = useState(['all']);

  const handleYearSelect = (year) => {
    const allIndividualYears = years.slice(1);

    if (year === 'all') {
      setSelectedYears(prev => {
        // If 'all' is selected, deselect all. Otherwise, select 'all'.
        if (prev.includes('all')) {
          return [];
        } else {
          return ['all'];
        }
      });
      return;
    }

    // Logic for individual year clicks
    setSelectedYears(prev => {
      const newYears = prev.includes('all') ? [] : [...prev];

      if (newYears.includes(year)) {
        // remove it
        const nextYears = newYears.filter(y => y !== year);
        return nextYears;
      } else {
        // add it
        const nextYears = [...newYears, year];
        // If adding this year means all years are now selected, collapse to ['all']
        if (nextYears.length === allIndividualYears.length) {
          return ['all'];
        }
        return nextYears;
      }
    });
  };

  // 선택된 학년과 연도에 따라 모의고사 리스트를 필터링한 결과
  const filteredTests = mockTests
    .filter((test) => {
      const matchGrade = selectedGrade === 'all' || String(test.grade) === selectedGrade;
      const matchYear = selectedYears.includes('all') || selectedYears.includes(String(test.year));
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
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Image source={require('../assets/icons/setting.png')} style={styles.settingsIcon} />
      </TouchableOpacity>

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
            {years.map((year) => {
              const isAllButton = year === 'all';

              let isSelected;
              if (isAllButton) {
                isSelected = selectedYears.includes('all');
              } else {
                isSelected = selectedYears.includes('all') || selectedYears.includes(String(year));
              }

              const isAllSelectedForStyling = isAllButton && isSelected;

              return (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearButton,
                    isSelected && !isAllButton && styles.selectedYearButton,
                    isAllSelectedForStyling && styles.allSelectedButton,
                  ]}
                  onPress={() => handleYearSelect(year)}
                >
                  <View style={styles.rowWrapper}>
                    {!isAllButton && (
                      <Image
                        source={isSelected ? checkIcon : plusIcon}
                        style={[
                          isSelected ? styles.checkIcon : styles.plusIcon,
                        ]}
                        resizeMode="contain"
                      />
                    )}
                    <Text
                      style={[
                        styles.yearButtonText,
                        isSelected && !isAllButton && styles.selectedYearButtonText,
                        isAllSelectedForStyling && styles.allSelectedButtonText,
                      ]}
                    >
                      {isAllButton ? (isSelected ? ' 선택해제 ' : ' 전체선택 ') : `${year}년`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>모의고사 목록</Text>
          {/* 기존의 View와 .map()을 FlatList 하나로 교체 */}
          <FlatList
            style={styles.listContainer} // 고정된 박스 스타일(높이, 배경색 등)을 여기에 적용
            data={filteredTests}
            // 각 항목에 고유한 키를 부여 (index보다 데이터 고유값으로 만드는 게 더 안정적)
            keyExtractor={(item, index) => `${item.year}-${item.month}-${item.grade}-${index}`}
            // 각 항목을 어떻게 그릴지 정의 (.map() 안의 내용을 그대로 옮기면 됨)
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate('MockTestDetail', {
                    year: item.year,
                    month: item.month,
                    grade: item.grade,
                  })
                }
              >
                <Text style={styles.listItemText}>
                  {item.year}년 {item.month}월 - {item.grade}학년 모의고사
                </Text>
                <Text style={styles.arrow}>&gt;</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <TouchableOpacity style={styles.recentButton} onPress={handleGoToRecent}>
          <Text style={styles.recentButtonText}>최근학습</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginTop: 60,
  },
  section: {
    marginBottom: normalize(50),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: '800',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center', // 버튼들을 수평 가운데로
    alignItems: 'center',     // 버튼 높이 맞추기
    gap: normalize(30),
  },
  button: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(19),
    borderRadius: normalize(21.5),
    borderWidth: 1,
    borderColor: '#cfcfcf',
  },
  selectedButton: {
    backgroundColor: '#78bfb8',
    borderColor: '#78bfb8',
  },
  buttonText: {
    fontSize: normalize(20),
    color: '#000',
  },
  selectedButtonText: {
    color: '#fff',
  },
  yearButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'center',
    gap: normalize(20),
  },
  yearButton: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(21.5),
    borderWidth: normalize(1.7),
    borderColor: '#cfcfcf',
    alignItems: 'center',
    marginBottom: normalize(-5),
  },
  selectedYearButton: {
    borderColor: '#78bfb8',
  },
  yearButtonText: {
    fontSize: normalize(20),
    color: '#000',
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(6)
  },
  selectedYearButtonText: {
    color: '#000', // Figma design shows black text for selected year
  },
  allSelectedButton: {
    backgroundColor: '#78bfb8',
    borderColor: '#78bfb8',
  },
  allSelectedButtonText: {
    color: '#fff',
  },
  plusIcon: {
    width: normalize(12),
    height: normalize(12),
  },

  checkIcon: {
    width: normalize(12),
    height: normalize(12),
  },
  listContainer: {
    height: normalize(300),
    backgroundColor: '#fff',
    borderRadius: normalize(13),
    padding: normalize(10),
    paddingHorizontal: normalize(20),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(20),
    paddingLeft: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  listItemText: {
    fontSize: normalize(20),
  },
  arrow: {
    fontSize: normalize(20),
    color: '#cfcfcf',
  },
  recentButton: {
    backgroundColor: '#78bfb8',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  recentButtonText: {
    color: '#fff',
    fontSize: normalize(23),
    fontWeight: '600',
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  settingsIcon: {
    width: normalize(40),
    height: normalize(40),
  },
});

