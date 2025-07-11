import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import fallbackWords from '../data/word_example100.json'; // 기본 단어 데이터

// 파일 내 컨테이너 컴포넌트 정의
function VocabularyContainer(props) {
  const { style, children, ...rest } = props;
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

export default function VocabularyScreen() {
    const route = useRoute(); // 라우트 파라미터 접근
    const [words, setWords] = useState([]); // 현재 단어 리스트
    const [index, setIndex] = useState(0); // 현재 단어 인덱스
    const [knownCount, setKnownCount] = useState(0); // 알고 있는 단어 개수
    const [showMeaning, setShowMeaning] = useState(false); // 해석 보기 여부

    useEffect(() => {
        // 전달받은 단어 리스트와 범위
        const paramWords = route.params?.words;
        const selectedRange = route.params?.range;

        // 단어 데이터가 없으면 fallback 사용
        const baseWords = Array.isArray(paramWords) && paramWords.length > 0 ? paramWords : fallbackWords;

        let filtered;
        if (selectedRange === '1-50') {
            filtered = baseWords.filter(word => word.number <= 50);
            
        } else if (selectedRange === '1-100') {
            filtered = baseWords; // 전체 사용
        } else {
            filtered = baseWords; // 기본은 전체
        }

        setWords(filtered); // 단어 리스트 세팅
        setIndex(0); // 인덱스 초기화
        setKnownCount(0); // 알고 있는 단어 개수 초기화
        setShowMeaning(false); // 해석 숨김
    }, [route.params]);

    // 단어 데이터가 없을 때 로딩 안내
    if (words.length === 0) {
        return (
            <VocabularyContainer style={styles.container}>
                <Text>단어를 불러오는 중입니다...</Text>
            </VocabularyContainer>
        );
    }
    
    const word = words[index]; // 현재 단어

    // '알고 있음' 버튼 클릭 시
    const handleKnow = () => {
        setKnownCount(knownCount + 1); // 알고 있는 단어 개수 증가
        nextWord();
    };

    // '모르겠음' 버튼 클릭 시
    const handleDontKnow = () => {
        nextWord();
    };

    // 다음 단어로 이동하는 함수
    const nextWord = () => {
        if (index < words.length - 1) {
            setIndex(index + 1);
            setShowMeaning(false);
        } else {
            alert(`회독 완료! 알고 있는 단어: ${knownCount} / ${words.length}`);
            setIndex(0);
            setKnownCount(0);
            setShowMeaning(false);
        }
    };

    return (
        <VocabularyContainer style={styles.container}>
            <Text style={styles.number}>{index + 1} / {words.length}</Text>
            <Text style={styles.word}>{word.word}</Text>
            {/* 해석 보기/숨기기 */}
            {showMeaning && (
                <VocabularyContainer style={styles.meaningBox}>
                    <Text style={styles.meaning}>{word.meaning}</Text>
                </VocabularyContainer>
            )}
            <Text style={styles.example}>{word.example}</Text>
            {/* 예문 해석 보기/숨기기 */}
            {showMeaning && (
                <VocabularyContainer style={styles.meaningBox}>
                    <Text style={styles.exampleMeaning}>{word.examplemeaning}</Text>
                </VocabularyContainer>
            )}
            <Button
                title={showMeaning ? "해석 숨기기" : "해석 보기"}
                onPress={() => setShowMeaning(!showMeaning)}
            />

            {/* 학습 결과 버튼 */}
            <VocabularyContainer style={styles.buttonRow}>
                <Button title="✅ 알고 있음" onPress={handleKnow} />
                <Button title="❌ 모르겠음" onPress={handleDontKnow} />
            </VocabularyContainer>
        </VocabularyContainer>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    number: { fontSize: 16, marginBottom: 10 },
    word: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
    meaningBox: { marginVertical: 20, alignItems: 'center' },
    meaning: { fontSize: 20, color: '#333', marginBottom: 10 },
    example: { fontSize: 16, fontStyle: 'italic' },
    exampleMeaning: { fontSize: 16, marginTop: 4, color: '#555' },
    buttonRow: { flexDirection: 'row', gap: 20 },
});