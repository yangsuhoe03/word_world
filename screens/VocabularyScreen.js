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
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


export default function VocabularyScreen({route, navigation}) {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [knownCount, setKnownCount] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState(null); // 공부 시작 시간
    const [endTime, setEndTime] = useState(null);     // 공부 종료 시간
    const [totalStudyTime, setTotalStudyTime] = useState(0); // 누적 공부 시간(초)

    useEffect(() => {
        // 전달받은 단어 리스트와 범위
        const paramWords = route.params.words;
        const selectedRange = route.params.range;

        // 단어 데이터가 없으면 fallback 사용
        const baseWords = Array.isArray(paramWords) && paramWords.length > 0 ? paramWords : fallbackWords;

        let filtered;
        if (selectedRange === '1-50') {
            filtered = baseWords.filter(word => word.number <= 50);
        } else if (selectedRange === '1-100') {
            filtered = baseWords;
        } else if (selectedRange === '1-150') {
            filtered = baseWords.filter(word => word.number <= 150);
        } else if (selectedRange === '1-200') {
            filtered = baseWords.filter(word => word.number <= 200);
        } else {
            filtered = baseWords;
        }

        setWords(shuffleArray(filtered));
        setIndex(0);
        setKnownCount(0);
        setShowMeaning(false);
        setIsFinished(false);
        setStartTime(Date.now()); // 시작할 때 시간 기록
        setEndTime(null);
        setTotalStudyTime(0); // 새 학습 시작 시 누적 시간 초기화
    }, [route.params]);

    // 회독 완료 시 종료 시간 기록 및 누적 공부 시간 저장
    useEffect(() => {
        if (isFinished && !endTime && startTime) {
            const now = Date.now();
            setEndTime(now);
            setTotalStudyTime(prev => prev + Math.floor((now - startTime) / 1000));
        }
    }, [isFinished, endTime, startTime]);

    // 단어 데이터가 없을 때 로딩 안내
    if (words.length === 0) {
        return (
            <VocabularyContainer style={styles.container}>
                <Text>단어를 불러오는 중입니다...</Text>
            </VocabularyContainer>
        );
    }

    const word = words[index]; // ★ 이 줄을 추가하세요

    // '알고 있음' 버튼 클릭 시
    const handleKnow = () => {
        setWords(prevWords => {
            const newWords = [...prevWords];
            newWords[index] = { ...newWords[index], isKnown: true };
            return newWords;
        });
        setKnownCount(knownCount + 1);
        nextWord();
    };

    // '모르겠음' 버튼 클릭 시
    const handleDontKnow = () => {
        nextWord();
    };

    // 다음 단어로 이동
    const nextWord = () => {
        if (index < words.length - 1) {
            setIndex(index + 1);
            setShowMeaning(false);
        } else {
            setIsFinished(true);
        }
    };

    // 모르는 단어만 다시 회독하기
    const handleRetryUnknown = () => {
        const unknownWords = words.filter(w => !w.isKnown);
        if (unknownWords.length === 0) {
            return;
        }
        // 이전 회독 시간 누적
        if (endTime && startTime) {
            setTotalStudyTime(prev => prev + Math.floor((endTime - startTime) / 1000));
        }
        setWords(shuffleArray(unknownWords));
        setIndex(0);
        setKnownCount(0);
        setShowMeaning(false);
        setIsFinished(false);
        setStartTime(Date.now());
        setEndTime(null);
    };

    // 홈으로 이동
    const handleFinish = () => {
        navigation.navigate('Home');
    };

    return (
        <VocabularyContainer style={styles.container}>
            {isFinished ? (
                (() => {
                    const unknownWords = words.filter(w => !w.isKnown);
                    // 마지막 회독 시간까지 누적
                    const elapsed = endTime && startTime
                        ? totalStudyTime
                        : totalStudyTime;
                    const min = Math.floor(elapsed / 60);
                    const sec = elapsed % 60;

                    if (unknownWords.length === 0) {
                        return (
                            <>
                                <Text style={styles.word}>회독 완료!</Text>
                                <Text style={styles.number}>
                                    알고 있는 단어: {knownCount} / {words.length}
                                </Text>
                                <Text style={styles.number}>
                                    총 공부 시간: {min}분 {sec}초
                                </Text>
                                <Button
                                    title="홈으로"
                                    onPress={handleFinish}
                                />
                            </>
                        );
                    }
                    return (
                        <>
                            <Text style={styles.word}>회독 완료!</Text>
                            <Text style={styles.number}>
                                알고 있는 단어: {knownCount} / {words.length}
                            </Text>
                            <Text style={styles.number}>
                                총 공부 시간: {min}분 {sec}초
                            </Text>
                            <VocabularyContainer style={styles.buttonRow}>
                                <Button title="모르는 단어만 다시 회독하기" onPress={handleRetryUnknown} />
                                <Button title="홈으로" onPress={handleFinish} />
                            </VocabularyContainer>
                        </>
                    );
                })()
            ) : (
                <>
                    {/* 회독 중일 때의 UI */}
                    <Text style={styles.number}>{index + 1} / {words.length}</Text>
                    <Text style={styles.word}>{word.word}</Text>
                    {showMeaning && (
                        <VocabularyContainer style={styles.meaningBox}>
                            <Text style={styles.meaning}>{word.meaning}</Text>
                        </VocabularyContainer>
                    )}
                    <Text style={styles.example}>{word.example}</Text>
                    {showMeaning && (
                        <VocabularyContainer style={styles.meaningBox}>
                            <Text style={styles.exampleMeaning}>{word.examplemeaning}</Text>
                        </VocabularyContainer>
                    )}
                    <Button
                        title={showMeaning ? "해석 숨기기" : "해석 보기"}
                        onPress={() => setShowMeaning(!showMeaning)}
                    />
                    <VocabularyContainer style={styles.buttonRow}>
                        <Button title="✅ 알고 있음" onPress={handleKnow} />
                        <Button title="❌ 모르겠음" onPress={handleDontKnow} />
                    </VocabularyContainer>
                </>
            )}
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