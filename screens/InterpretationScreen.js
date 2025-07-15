// 이 화면은 사용자가 선택한 해석(문장 해석) 문제의 문장들을 순서대로 학습할 수 있도록 해주는 화면입니다.
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Container from '../components/Container';

export default function Interpretation({route, navigation}) {
  const { number, interpretations } = route.params || {};
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showKorean, setShowKorean] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  useEffect(() => {
    // interpretations에서 해당 번호의 문장 리스트 찾기
    if (interpretations && Array.isArray(interpretations)) {
      const found = interpretations.find(item => item.number === number);
      if (found && found.sentences) {
        setSentences(found.sentences);
        setCurrentIndex(0);
        setShowKorean(false);
        setIsFinished(false);
        setStartTime(Date.now());
        setEndTime(null);
        setTotalStudyTime(0);
      }
    }
  }, [number, interpretations]);

  useEffect(() => {
    if (isFinished && !endTime && startTime) {
      const now = Date.now();
      setEndTime(now);
      setTotalStudyTime(prev => prev + Math.floor((now - startTime) / 1000));
    }
  }, [isFinished, endTime, startTime]);

  // 문장 데이터가 없을 때 로딩 안내
  if (sentences.length === 0) {
    return (
      <Container style={styles.container}>
        <Text>문제 데이터를 불러오는 중입니다...</Text>
      </Container>
    );
  }

  const currentSentence = sentences[currentIndex]; // 현재 문장

  // '알겠음' 버튼 클릭 시
  const handleKnow = () => {
    setSentences(prev => {
      const arr = [...prev];
      arr[currentIndex] = { ...arr[currentIndex], isKnown: true };
      return arr;
    });
    nextSentence();
  };

  // '모르겠음' 버튼 클릭 시
  const handleDontKnow = () => {
    setSentences(prev => {
      const arr = [...prev];
      arr[currentIndex] = { ...arr[currentIndex], isKnown: false };
      return arr;
    });
    nextSentence();
  };

  // 다음 문장으로 이동
  const nextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowKorean(false);
    } else {
      setIsFinished(true);
    }
  };

  // 모르는 문장만 다시 회독하기
  const handleRetryUnknown = () => {
    const unknown = sentences.filter(s => s.isKnown === false);
    if (unknown.length === 0) return;
    // 이전 회독 시간 누적
    if (endTime && startTime) {
      setTotalStudyTime(prev => prev + Math.floor((endTime - startTime) / 1000));
    }
    setSentences(unknown);
    setCurrentIndex(0);
    setShowKorean(false);
    setIsFinished(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  // 홈으로 이동
  const handleFinish = () => {
    navigation.navigate('Home');
  };

  if (isFinished) {
    const unknown = sentences.filter(s => s.isKnown === false);
    const knownCount = sentences.filter(s => s.isKnown === true).length;
    const min = Math.floor(totalStudyTime / 60);
    const sec = totalStudyTime % 60;
    return (
      <Container style={styles.container}>
        <Text style={styles.word}>회독 완료!</Text>
        <Text style={styles.number}>알고 있는 문장: {knownCount} / {sentences.length}</Text>
        <Text style={styles.number}>총 공부 시간: {min}분 {sec}초</Text>
        {unknown.length === 0 ? (
          <Button title="홈으로" onPress={handleFinish} />
        ) : (
          <Container style={styles.buttonRow}>
            <Button title="모르는 문장 다시하기" onPress={handleRetryUnknown} />
            <Button title="홈으로" onPress={handleFinish} />
          </Container>
        )}
      </Container>
    );
  }

  const handleToggleKorean = () => {
    setShowKorean(prev => !prev);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.index}>
          {currentIndex + 1} / {sentences.length}
        </Text>
        <Text style={styles.word}>
          {showKorean ? currentSentence.korean : currentSentence.english}
        </Text>
        <Button title={showKorean ? "영어로 보기" : "한국어로 보기"} onPress={handleToggleKorean} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="알겠음" onPress={handleKnow} />
        <Button title="모르겠음" onPress={handleDontKnow} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  index: {
    fontSize: 16,
    marginBottom: 8,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
});
