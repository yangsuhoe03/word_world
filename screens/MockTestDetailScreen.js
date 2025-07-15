// 이 화면은 모의고사(테스트) 상세 정보를 보여주는 화면입니다. 사용자가 선택한 모의고사 문제의 상세 내용과 풀이를 확인할 수 있습니다.
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// 파일 내 컨테이너 컴포넌트 정의
function MockTestDetailContainer(props) {
  const { style, children, ...rest } = props;
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

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

    return (
        <MockTestDetailContainer style={styles.container}>
            <Text style={styles.title}>📘 모의고사 상세 정보</Text>
            <Text style={styles.info}>🗓 {year}년 {month}월</Text>
            <Text style={styles.info}>🎓 {grade}학년</Text>

            {/* 학습 유형별 이동 버튼 */}
            <MockTestDetailContainer style={styles.buttonContainer}>
                <Button title="1. 어휘" onPress={() => handleNavigate('VocabularySelectRange')} />
                <Button title="2. 해석" onPress={() => handleNavigate('InterpretationSelectNumber')} />
                <Button title="3. 주제 외우기" onPress={() => handleNavigate('Topic')} />
                
            </MockTestDetailContainer>
        </MockTestDetailContainer>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    info: { fontSize: 18, marginBottom: 10 },
    buttonContainer: { width: '100%', marginTop: 30, gap: 10 },
});