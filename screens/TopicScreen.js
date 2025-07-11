// TopicScreen 컴포넌트
// - 주제별 단어 목록 화면의 메인 컴포넌트입니다.
// - 각 주제를 선택하면 해당 주제에 속한 단어들을 확인할 수 있습니다.
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import topicData from '../data/topic_example.json';

export default function TopicScreen() {
  const [index, setIndex] = useState(0);
  const [showTopicEn, setShowTopicEn] = useState(false);
  const [showTopicKo, setShowTopicKo] = useState(false);

  const current = topicData[index];

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

  if (!current) {
    return (
      <View style={styles.container}>
        <Text>주제 데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.number}>문제 번호: {current.number}</Text>

      <Text style={styles.passage}>{current.passage}</Text>
      
      {showTopicEn && <Text style={styles.topicEn}>• {current.topic_en}</Text>}
      {showTopicKo && <Text style={styles.topicKo}>→ {current.topic_ko}</Text>}

      <View style={styles.topicButtons}>
        <Button
          title={showTopicEn ? "주제(영어) 숨기기" : "주제(영어)"}
          onPress={() => setShowTopicEn(!showTopicEn)}
        />
        <Button
          title={showTopicKo ? "주제(한글) 숨기기" : "주제(한글)"}
          onPress={() => setShowTopicKo(!showTopicKo)}
        />
      </View>


      <View style={styles.buttonRow}>
        <Button title="✅ 알고 있음" onPress={handleNext} />
        <Button title="❌ 모르겠음" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 18, marginBottom: 10 },
  passage: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  topicButtons: { flexDirection: 'row', gap: 20, marginVertical: 10 },
  topicEn: { fontSize: 18, color: '#333', marginTop: 10 },
  topicKo: { fontSize: 18, color: '#666', marginTop: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 20, gap: 20 },
});