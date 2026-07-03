// 이 화면은 사용자가 단어 목록을 보고, 단어별로 상세 정보를 확인하거나 학습할 수 있도록 하는 단어장(어휘) 메인 화면입니다.
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import fallbackWords from '../data/word_example100.json'; // 기본 단어 데이터
import Container from '../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const year = route.params.year;
        const month = route.params.month;
        const grade = route.params.grade;

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

    // 회독 완료 시 reviewCount 저장 (딱 한 번만)
    useEffect(() => {
        if (isFinished && endTime && words.length > 0) {
            const unknownWords = words.filter(w => !w.isKnown);
            if (unknownWords.length === 0) {

                const elapsed = totalStudyTime;
                console.log('increaseReviewCount', route.params.range, elapsed);
                increaseReviewCount(route.params.range, elapsed);
            }
        }
        // eslint-disable-next-line
    }, [isFinished, endTime]);
      

    // 단어 데이터가 없을 때 로딩 안내
    if (words.length === 0) {
        return (
            <Container style={styles.container}>
                <Text>단어를 불러오는 중입니다...</Text>
            </Container>
        );
    }

    const word = words[index];

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
            setTotalStudyTime(prev => prev + Math.floor((endTime - startTime) / 1000))
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

    // 회독 횟수 증가 함수 (연도/월/학년/범위별 저장)
    const increaseReviewCount = async (range, elapsedSeconds) => {
        try {
        const year = route.params.year;
        const month = route.params.month;
        const grade = route.params.grade;
        const key = `${year}_${String(month).padStart(2, '0')}_${grade}`;
        const data = await AsyncStorage.getItem('reviewInfo');
        let reviewInfo = data ? JSON.parse(data) : {};
        if (!reviewInfo[key]) {
          reviewInfo[key] = {};
        }
        if (!reviewInfo[key][range]) {
          reviewInfo[key][range] = { reviewCount: 0, reviewTimes: [] };
        }
        reviewInfo[key][range].reviewCount += 1;
        reviewInfo[key][range].lastReviewDate = new Date().toISOString();
        // 회독별로 seconds, date(YYYY-MM-DD) 저장
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        reviewInfo[key][range].reviewTimes.push({ seconds: elapsedSeconds, date: dateStr });
        await AsyncStorage.setItem('reviewInfo', JSON.stringify(reviewInfo));
      } catch (e) {
        console.error('회독 정보 저장 실패:', e);
      }
    };



    return (
        <Container style={styles.container}>
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
                        // 마지막 회독 시간 계산
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
                            <Container style={styles.buttonRow}>
                                <Button title="모르는 단어만 다시 회독하기" onPress={handleRetryUnknown} />
                                <Button title="홈으로" onPress={handleFinish} />
                            </Container>
                        </>
                    );
                })()
            ) : (
                <>
                    {/* 회독 중일 때의 UI */}
                    <View style={styles.card}>
                        <Text style={styles.number}>{index + 1} / {words.length}</Text>
                        <Text style={styles.word}>{word.word}</Text>
                        <Text style={styles.meaning}>{showMeaning ? word.meaning : ''}</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.example}>{word.example}</Text>
                        <Text style={styles.exampleMeaning}>{showMeaning ? word.examplemeaning : ''}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.meaningButton, { backgroundColor: '#FFA6A6' }]}
                        onPress={() => setShowMeaning(!showMeaning)}
                    >
                        <Text style={styles.meaningButtonText}>뜻</Text>
                    </TouchableOpacity>
                    
                    <Container style={styles.buttonRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleKnow}>
                            <Text style={styles.actionButtonText}>알고있음</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleDontKnow}>
                            <Text style={styles.actionButtonText}>모르겠음</Text>
                        </TouchableOpacity>
                    </Container>
                </>
            )}
        </Container>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    number: {
        position: 'absolute',
        top: 15,
        left: 15,
        fontSize: 16,
        color: '#888',
    },
    word: {
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    meaning: {
        fontSize: 24,
        color: '#333',
        marginTop: 10,
    },
    example: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    exampleMeaning: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
        textAlign: 'center',
    },
    meaningButton: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginVertical: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    meaningButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    actionButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
});
