// 이 화면은 모의고사(테스트) 상세 정보를 보여주는 화면입니다. 사용자가 선택한 모의고사 문제의 상세 내용과 풀이를 확인할 수 있습니다.
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, BackHandler } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Container from '../components/Container';

export default function MockTestDetailScreen({route, navigation}) {
    // const route = useRoute(); // 라우트 파라미터 접근
    // const navigation = useNavigation(); // 화면 이동을 위한 네비게이션 객체
    const year = route.params.year;
    const month = route.params.month;
    const grade = route.params.grade;

    // 각 학습 화면으로 이동하는 함수
    const handleNavigate = (screen) => {
        navigation.navigate(screen, { year, month, grade }); // 학습 화면으로 이동
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
            <Button
              title="뒤로"
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }}
            />
          ),
        });
      }, [navigation]);
    


    return (
        <Container style={styles.container}>
            <Text style={styles.title}>📘 모의고사 상세 정보</Text>
            <Text style={styles.info}>🗓 {year}년 {month}월</Text>
            <Text style={styles.info}>🎓 {grade}학년</Text>

            {/* 학습 유형별 이동 버튼 */}
            <Container style={styles.buttonContainer}>
                <Button title="1. 어휘" onPress={() => handleNavigate('VocabularySelectRange')} />
                <Button title="2. 해석" onPress={() => handleNavigate('InterpretationSelectNumber')} />
                <Button title="3. 주제 외우기" onPress={() => handleNavigate('Topic')} />
                
            </Container>
        </Container>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    info: { fontSize: 18, marginBottom: 10 },
    buttonContainer: { width: '100%', marginTop: 30, gap: 10 },
});
