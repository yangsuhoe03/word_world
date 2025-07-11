// InterpretationScreen 컴포넌트
// - 단어 해석 연습 화면의 메인 컴포넌트입니다.
// - 단어와 뜻을 보여주고, 사용자가 해석을 확인하거나 다음 단어로 넘어갈 수 있습니다.
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import interpretationData from '../data/interpretation_example.json';

export default function Interpretation() {
  const route = useRoute();
  const { number } = route.params || {};
  
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showKorean, setShowKorean] = useState(false);

  useEffect(() => {
    const found = interpretationData.find(item => item.number === number);
    if (found && found.sentences) {
      setSentences(found.sentences);
      setCurrentIndex(0);
      setShowKorean(false);
    }
  }, [number]);

  if (sentences.length === 0) {
    return (
      <View style={styles.container}>
        <Text>문제 데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  const currentSentence = sentences[currentIndex];

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowKorean(false);
    } else {
      alert("문장 학습이 완료되었습니다!");
      setCurrentIndex(0);
      setShowKorean(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.number}>문제: {number}</Text>
      <Text style={styles.progress}>{currentIndex + 1} / {sentences.length}</Text>

      <Text style={styles.english}>{currentSentence.english}</Text>

      {showKorean && (
        <Text style={styles.korean}>{currentSentence.korean}</Text>
      )}

      <View style={styles.buttonGroup}>
        <Button
          title={showKorean ? "해석 숨기기" : "해석 보기"}
          onPress={() => setShowKorean(!showKorean)}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="✅ 알겠음" onPress={handleNext} />
        <Button title="❌ 모르겠음" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  number: { fontSize: 20, marginBottom: 10 },
  progress: { fontSize: 16, color: '#777', marginBottom: 10 },
  english: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  korean: { fontSize: 18, color: '#555', marginTop: 10, textAlign: 'center' },
  buttonGroup: { marginVertical: 20 },
  buttonRow: { flexDirection: 'row', gap: 20 },
});