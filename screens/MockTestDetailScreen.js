// 이 화면은 모의고사(테스트) 상세 정보를 보여주는 화면입니다. 사용자가 선택한 모의고사 문제의 상세 내용과 풀이를 확인할 수 있습니다.
import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, BackHandler, TouchableOpacity, } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Container from '../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function MockTestDetailScreen({ route, navigation }) {
  const year = route.params.year;
  const month = route.params.month;
  const grade = route.params.grade;

  // 뒤로가기(하드웨어/제스처/상단) 시 무조건 홈으로 이동
  // useFocusEffect(
  //     React.useCallback(() => {
  //         const goHome = () => {
  //             navigation.reset({
  //                 index: 0,
  //                 routes: [{ name: 'Home' }],
  //             });
  //             return true;
  //         };
  //         BackHandler.addEventListener('hardwareBackPress', goHome);
  //         const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //             e.preventDefault();
  //             // setTimeout으로 navigation.reset을 비동기로 실행
  //             setTimeout(() => {
  //                 navigation.reset({
  //                     index: 0,
  //                     routes: [{ name: 'Home' }],
  //                 });
  //             }, 0);
  //         });
  //         return () => {
  //             BackHandler.removeEventListener('hardwareBackPress', goHome);
  //             unsubscribe();
  //         };
  //     }, [navigation])
  // );

  // 각 학습 화면으로 이동하는 함수
  const handleNavigate = (screen) => {
    navigation.navigate(screen, { year, month, grade });
  };


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  // 헤더 뒤로가기 버튼도 홈으로 이동
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }}
        >
          {/* 뒤로가기 아이콘 */}
          <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
      title: `${year}년 ${month}월 ${grade}학년 모의고사`, // 헤더 이름 수정
    });
  }, [navigation]);


  useEffect(() => {
    const saveRecent = async () => {
      const recentTest = { year, month, grade };
      try {
        await AsyncStorage.setItem('recentMockTest', JSON.stringify(recentTest));
      } catch (e) {
        console.error('최근 학습 저장 오류:', e);
      }
    };
    saveRecent();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.section}/>

      <View style={styles.section}>
        <Text style={styles.title}>모의고사</Text>

        <View style={styles.box}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('OriginalProblem')}
          >
            <Text style={styles.menuText}>문제 원문 보기</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('Explanation')}
          >
            <Text style={styles.menuText}>해설지 보기</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('TopIncorrect')}
          >
            <Text style={styles.menuText}>오답률 Top 10</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.section}>
        <Text style={styles.title}>학습</Text>

        <View style={styles.box}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('VocabularySelectRange')}
          >
            <Text style={styles.menuText}>어휘공부</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('InterpretationSelectNumber')}
          >
            <Text style={styles.menuText}>해석</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('Topic')}
          >
            <Text style={styles.menuText}>주제 외우기</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

      const styles = StyleSheet.create({
        container: {
        flex: 1,
      padding: 24,
      backgroundColor: '#F2F2F2'
  },
      section: {
        marginBottom: 40, // 섹션 사이 간격
  },
      title: {
        fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      marginLeft: 26,
      alignSelf: 'flex-start'
  },
      box: {
        width: '100%',
      borderWidth: 1,
      borderRadius: 16,
      padding: 3,
      borderColor: '#ddd',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
  },
      menuItem: {
        flexDirection: 'row',            // 글씨 + 아이콘 가로 배치
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 30,
  },
      menuText: {
        fontSize: 18,
      fontWeight: '400',
      color: '#000000ff',
  },
      divider: {
        height: 1,
      backgroundColor: '#F2F2F2',
  },
});