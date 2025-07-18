// 이 화면은 모의고사(테스트) 상세 정보를 보여주는 화면입니다. 사용자가 선택한 모의고사 문제의 상세 내용과 풀이를 확인할 수 있습니다.
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Container from '../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Container style={styles.container}>
            <Text style={styles.title}>📘 모의고사 상세 정보</Text>
            <Text style={styles.info}>🗓 {year}년 {month}월</Text>
            <Text style={styles.info}>🎓 {grade}학년</Text>
            <Container style={styles.buttonContainer}>
                <Button title="1. 어휘" onPress={() => handleNavigate('VocabularySelectRange')} />
                <Button title="2. 해석" onPress={() => handleNavigate('InterpretationSelectNumber')} />
                <Button title="3. 주제 외우기" onPress={() => handleNavigate('Topic')} />
            </Container>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    info: { fontSize: 18, marginBottom: 10 },
    buttonContainer: { width: '100%', marginTop: 30, gap: 10 },
});
