import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wordFileMap } from '../data/wordFileMap.js';
import fallbackData from '../data/word_example100.json';

// 파일 내 컨테이너 컴포넌트 정의
function VocabularySelectRangeContainer(props) {
  const { style, children, ...rest } = props;
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

export default function VocabularySelectRangeScreen({route, navigation}) {
    // const navigation = useNavigation(); // 화면 이동을 위한 네비게이션 객체
    // const route = useRoute(); // 라우트 파라미터 접근
    // const { year, month, grade } = route.params || {}; // 전달받은 연도, 월, 학년
    const year = route.params.year;
    console.log('year', route);
    console.log('year', route.params);
    const month = route.params.month;
    const grade = route.params.grade;

    const [wordList, setWordList] = useState(null); // 단어 리스트 상태

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
        });
    };

    return (
        <VocabularySelectRangeContainer style={styles.container}>
            <Text style={styles.title}>어휘 회독 범위를 선택하세요</Text>
            {/* 1~50번 범위 선택 버튼 */}
            <TouchableOpacity style={styles.button} onPress={() => handleSelectRange('1-50')}>
                <Text style={styles.buttonText}>1 ~ 50번</Text>
            </TouchableOpacity>
            {/* 1~100번 범위 선택 버튼 */}
            <TouchableOpacity style={styles.button} onPress={() => handleSelectRange('1-100')}>
                <Text style={styles.buttonText}>1 ~ 100번</Text>
            </TouchableOpacity>
        </VocabularySelectRangeContainer>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 20 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginVertical: 10 },
    buttonText: { color: 'white', fontSize: 16 },
});