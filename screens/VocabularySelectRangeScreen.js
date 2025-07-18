// 이 화면은 사용자가 단어 학습 범위를 선택할 수 있도록 도와주는 화면입니다. 예를 들어, 특정 범위의 단어만 골라서 학습할 수 있습니다.
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wordFileMap } from '../data/wordFileMap.js';
import fallbackData from '../data/word_example100.json';
import Container from '../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VocabularySelectRangeScreen({route, navigation}) {
    // const navigation = useNavigation(); // 화면 이동을 위한 네비게이션 객체
    // const route = useRoute(); // 라우트 파라미터 접근
    // const { year, month, grade } = route.params || {}; // 전달받은 연도, 월, 학년
    const year = route.params.year;
    //console.log('year', route);
    //console.log('year', route.params);
    const month = route.params.month;
    const grade = route.params.grade;

    const [wordList, setWordList] = useState(null); // 단어 리스트 상태
    const [reviewInfo, setReviewInfo] = useState({});

    useEffect(() => {
        const fetchReviewInfo = async () => {
            try {
                const data = await AsyncStorage.getItem('reviewInfo');
                const parsed = data ? JSON.parse(data) : {};
                setReviewInfo(parsed);
                console.log('reviewInfo', parsed);
            } catch (e) {
                console.error('회독 정보 불러오기 실패:', e);
            }
        };
        fetchReviewInfo();

    }, []);

    useEffect(() => {
        // key 예시: 2024_03_3
        const key = `${year}_${String(month).padStart(2, '0')}_${grade}`; // 파일명 규칙에 맞게 key 생성
        const data = wordFileMap[key]; // 해당 key로 단어 데이터 찾기
        
        if (data && Array.isArray(data)) {
            setWordList(data); // 데이터가 있으면 세팅
        } else {
            console.warn(`${key}_word.js 파일이 없어 기본 단어로 대체합니다.`);
            setWordList(fallbackData); // 없으면 fallback 데이터 사용
        }
    }, [year, month, grade]);

    // 범위 선택 시 단어 리스트와 함께 Vocabulary 화면으로 이동
    const handleSelectRange = (range) => {
        if (!wordList) {
            Alert.alert('단어 데이터를 불러오는 중입니다.');
            return;
        }

        navigation.navigate('Vocabulary', {
            range,
            words: wordList,
            year,
            month,
            grade
        });
    };

    // 전체 reviewInfo 삭제
    const clearReviewInfo = async () => {
        try {
            await AsyncStorage.removeItem('reviewInfo');
            setReviewInfo({});
            Alert.alert('저장된 회독 정보가 삭제되었습니다.');
        } catch (e) {
            console.error('회독 정보 삭제 실패:', e);
        }
    };

    // 범위 목록 정의
    const ranges = [
        { label: '1 ~ 50번', value: '1-50' },
        { label: '1 ~ 100번', value: '1-100' },
        // 앞으로 범위가 추가될 경우 여기에 추가
    ];

    const key = `${year}_${String(month).padStart(2, '0')}_${grade}`;
    const infoForKey = reviewInfo[key] || {};

    return (
        <Container style={styles.container}>
            <Text style={styles.title}>어휘 회독 범위를 선택하세요</Text>
            {ranges.map(rangeObj => {
                const rangeData = infoForKey[rangeObj.value];
                return (
                    <TouchableOpacity
                        key={rangeObj.value}
                        style={styles.button}
                        onPress={() => handleSelectRange(rangeObj.value)}
                    >
                        <Text style={styles.buttonText}>
                            {rangeObj.label} {rangeData && rangeData.reviewCount > 0
                                ? `(${rangeData.reviewCount}회, 최근: ${
                                    rangeData.reviewTimes.length > 0
                                      ? `${Math.floor(rangeData.reviewTimes.slice(-1)[0].seconds/60)}분 ${rangeData.reviewTimes.slice(-1)[0].seconds%60}초 (${rangeData.reviewTimes.slice(-1)[0].date})`
                                      : ''
                                  })`
                                : ''}
                        </Text>
                        {rangeData && rangeData.reviewTimes && rangeData.reviewTimes.length > 0 && (
                            rangeData.reviewTimes.map((t, idx) => (
                                <Text key={idx} style={{color: '#fff', fontSize: 13}}>
                                    {idx+1}회독: {Math.floor(t.seconds/60)}분 {t.seconds%60}초 ({t.date})
                                </Text>
                            ))
                        )}
                    </TouchableOpacity>
                );
            })}
            {/* 회독 정보 초기화 버튼 */}
            <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}]} onPress={clearReviewInfo}>
                <Text style={styles.buttonText}>회독 정보 초기화</Text>
            </TouchableOpacity>
        </Container>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 20 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginVertical: 10 },
    buttonText: { color: 'white', fontSize: 16 },
});
