// 이 화면은 다양한 주제별로 단어 또는 문장 학습을 할 수 있도록 주제 목록을 보여주는 화면입니다.
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
// import topicData from '../data/topic_example.json'; // 더 이상 직접 import하지 않음
import { topicFileMap } from '../data/topicFileMap';


// 파일 내 컨테이너 컴포넌트 정의
function TopicContainer(props) {
  const { style, scroll, children, ...rest } = props;
  if (scroll) {
    return (
      <ScrollView contentContainerStyle={style} {...rest}>
        {children}
      </ScrollView>
    );
  }
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

// 배열을 랜덤하게 섞는 함수
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function TopicScreen({route, navigation}) {
  // 주제 데이터 상태로 관리
  const [topicData, setTopicData] = useState(null); // 주제 데이터 배열
  const [index, setIndex] = useState(0); // 현재 주제 인덱스
  const [showTopicEn, setShowTopicEn] = useState(false); // 영어 주제 보기 여부
  const [showTopicKo, setShowTopicKo] = useState(false); // 한글 주제 보기 여부
  const [isFinished, setIsFinished] = useState(false); // 회독 완료 여부
  const [startTime, setStartTime] = useState(null); // 공부 시작 시간
  const [endTime, setEndTime] = useState(null); // 공부 종료 시간
  const [totalStudyTime, setTotalStudyTime] = useState(0); // 누적 공부 시간(초)

  // route에서 연도, 월, 학년 파라미터 받기
  const year = route.params.year;
  const month = route.params.month;
  const grade = route.params.grade;

  // 주제 데이터 동적 로딩
  useEffect(() => {
    // key 예시: 2025_03_1
    const key = `${year}_${String(month).padStart(2, '0')}_${grade}`; // 파일명 규칙에 맞게 key 생성
    const data = topicFileMap[key]; // 해당 key로 주제 데이터 찾기
    setTopicData(shuffleArray(data)); // 전체를 랜덤하게 섞어서 사용
    setIndex(0); // 새 데이터 로드 시 인덱스 초기화
    setShowTopicEn(false);
    setShowTopicKo(false);
    setIsFinished(false);
    setStartTime(Date.now()); // 시작 시간 기록
    setEndTime(null);
    setTotalStudyTime(0); // 새 학습 시작 시 누적 시간 초기화
  }, [year, month, grade]);

  // 회독 완료 시 종료 시간 기록 및 누적 공부 시간 저장
  useEffect(() => {
    if (isFinished && !endTime && startTime) {
      const now = Date.now();
      setEndTime(now);
      setTotalStudyTime(prev => prev + Math.floor((now - startTime) / 1000));
    }
  }, [isFinished, endTime, startTime]);

  // topicData가 없거나 아직 로딩 중이면 안내
  if (!topicData || topicData.length === 0) {
    return (
      <TopicContainer style={styles.container}>
        <Text>주제 데이터를 불러오는 중입니다...</Text>
      </TopicContainer>
    );
  }

  // 현재 주제 데이터
  const current = topicData[index];

  // '알고 있음' 버튼 클릭 시
  const handleKnow = () => {
    setTopicData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], isKnown: true };
      return newData;
    });
    nextTopic();
  };

  // '모르겠음' 버튼 클릭 시
  const handleDontKnow = () => {
    nextTopic();
  };

  // 다음 주제로 이동
  const nextTopic = () => {
    if (index < topicData.length - 1) {
      setIndex(index + 1);
      setShowTopicEn(false);
      setShowTopicKo(false);
    } else {
      setIsFinished(true);
    }
  };

  // 모르는 주제만 다시 회독하기
  const handleRetryUnknown = () => {
    const unknownTopics = topicData.filter(t => !t.isKnown);
    if (unknownTopics.length === 0) {
      return;
    }
    // 이전 회독 시간 누적
    if (endTime && startTime) {
      setTotalStudyTime(prev => prev + Math.floor((endTime - startTime) / 1000));
    }
    setTopicData(shuffleArray(unknownTopics));
    setIndex(0);
    setShowTopicEn(false);
    setShowTopicKo(false);
    setIsFinished(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  // 홈으로 이동
  const handleFinish = () => {
    navigation.navigate('Home');
  };

  // 회독 완료 시 UI
  if (isFinished) {
    const unknownTopics = topicData.filter(t => !t.isKnown);
    const knownCount = topicData.filter(t => t.isKnown).length;
    const elapsed = endTime && startTime ? totalStudyTime : totalStudyTime;
    const min = Math.floor(elapsed / 60);
    const sec = elapsed % 60;

    if (unknownTopics.length === 0) {
      // 모두 알고 있음
      return (
        <TopicContainer style={styles.container}>
          <Text style={styles.word}>회독 완료!</Text>
          <Text style={styles.number}>알고 있는 주제: {knownCount} / {topicData.length}</Text>
          <Text style={styles.number}>총 공부 시간: {min}분 {sec}초</Text>
          <Button title="홈으로" onPress={handleFinish} />
        </TopicContainer>
      );
    }
    // 모르는 주제가 있을 때
    return (
      <TopicContainer style={styles.container}>
        <Text style={styles.word}>회독 완료!</Text>
        <Text style={styles.number}>알고 있는 주제: {knownCount} / {topicData.length}</Text>
        <Text style={styles.number}>총 공부 시간: {min}분 {sec}초</Text>
        <TopicContainer style={styles.buttonRow}>
          <Button title="모르는 주제만 다시 회독하기" onPress={handleRetryUnknown} />
          <Button title="홈으로" onPress={handleFinish} />
        </TopicContainer>
      </TopicContainer>
    );
  }

  // 회독 중 UI
  return (
    <TopicContainer style={styles.container} scroll>
      <Text style={styles.number}>{index + 1} / {topicData.length}</Text>
      <Text style={styles.passage}>{current.passage}</Text>
      {/* 영어 주제 보기/숨기기 */}
      {showTopicEn && <Text style={styles.topicEn}>• {current.topic_en}</Text>}
      {/* 한글 주제 보기/숨기기 */}
      {showTopicKo && <Text style={styles.topicKo}>→ {current.topic_ko}</Text>}
      <TopicContainer style={styles.topicButtons}>
        <Button
          title={showTopicEn ? "주제(영어) 숨기기" : "주제(영어)"}
          onPress={() => setShowTopicEn(!showTopicEn)}
        />
        <Button
          title={showTopicKo ? "주제(한글) 숨기기" : "주제(한글)"}
          onPress={() => setShowTopicKo(!showTopicKo)}
        />
      </TopicContainer>
      <TopicContainer style={styles.buttonRow}>
        <Button title="✅ 알고 있음" onPress={handleKnow} />
        <Button title="❌ 모르겠음" onPress={handleDontKnow} />
      </TopicContainer>
    </TopicContainer>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 18, marginBottom: 10 },
  word: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  passage: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  topicButtons: { flexDirection: 'row', gap: 20, marginVertical: 10 },
  topicEn: { fontSize: 18, color: '#333', marginTop: 10 },
  topicKo: { fontSize: 18, color: '#666', marginTop: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 20, gap: 20 },
});