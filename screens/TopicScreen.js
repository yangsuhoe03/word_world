// 이 화면은 다양한 주제별로 단어 또는 문장 학습을 할 수 있도록 주제 목록을 보여주는 화면입니다.
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import topicData from '../data/topic_example.json';

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

export default function TopicScreen() {
  const [index, setIndex] = useState(0); // 현재 주제 인덱스
  const [showTopicEn, setShowTopicEn] = useState(false); // 영어 주제 보기 여부
  const [showTopicKo, setShowTopicKo] = useState(false); // 한글 주제 보기 여부

  const current = topicData[index]; // 현재 주제 데이터

  // 다음 문제로 이동하는 함수
  const handleNext = () => {
    if (index < topicData.length - 1) {
      setIndex(index + 1);
      setShowTopicEn(false);
      setShowTopicKo(false);
    } else {
      alert('모든 주제 학습을 완료했습니다!');
      setIndex(0);
      setShowTopicEn(false);
      setShowTopicKo(false);
    }
  };

  // 데이터가 없을 때 로딩 안내
  if (!current) {
    return (
      <TopicContainer style={styles.container}>
        <Text>주제 데이터를 불러오는 중입니다...</Text>
      </TopicContainer>
    );
  }

  return (
    <TopicContainer style={styles.container} scroll>
      <Text style={styles.number}>문제 번호: {current.number}</Text>

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

      {/* 학습 결과 버튼 */}
      <TopicContainer style={styles.buttonRow}>
        <Button title="✅ 알고 있음" onPress={handleNext} />
        <Button title="❌ 모르겠음" onPress={handleNext} />
      </TopicContainer>
    </TopicContainer>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 18, marginBottom: 10 },
  passage: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  topicButtons: { flexDirection: 'row', gap: 20, marginVertical: 10 },
  topicEn: { fontSize: 18, color: '#333', marginTop: 10 },
  topicKo: { fontSize: 18, color: '#666', marginTop: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 20, gap: 20 },
});