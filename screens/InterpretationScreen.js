import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import interpretationData from '../data/interpretation_example.json';

// 파일 내 컨테이너 컴포넌트 정의
function InterpretationContainer(props) {
  const { style, children, ...rest } = props;  
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

export default function Interpretation() {
  const route = useRoute(); // 라우트 파라미터 접근
  const { number } = route.params || {}; // 선택된 문제 번호
  
  const [sentences, setSentences] = useState([]); // 해당 문제의 문장 리스트
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 문장 인덱스
  const [showKorean, setShowKorean] = useState(false); // 해석 보기 여부

  useEffect(() => {
    // interpretationData에서 해당 번호의 문장 리스트 찾기
    const found = interpretationData.find(item => item.number === number);
    if (found && found.sentences) {
      setSentences(found.sentences);
      setCurrentIndex(0);
      setShowKorean(false);
    }
  }, [number]);

  // 문장 데이터가 없을 때 로딩 안내
  if (sentences.length === 0) {
    return (
      <InterpretationContainer style={styles.container}>
        <Text>문제 데이터를 불러오는 중입니다...</Text>
      </InterpretationContainer>
    );
  }

  const currentSentence = sentences[currentIndex]; // 현재 문장

  // 다음 문장으로 이동하는 함수
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
    <InterpretationContainer style={styles.container}>
      <Text style={styles.number}>문제: {number}</Text>
      <Text style={styles.progress}>{currentIndex + 1} / {sentences.length}</Text>

      <Text style={styles.english}>{currentSentence.english}</Text>

      {/* 해석 보기/숨기기 */}
      {showKorean && (
        <Text style={styles.korean}>{currentSentence.korean}</Text>
      )}

      <InterpretationContainer style={styles.buttonGroup}>
        <Button
          title={showKorean ? "해석 숨기기" : "해석 보기"}
          onPress={() => setShowKorean(!showKorean)}
        />
      </InterpretationContainer>

      {/* 학습 결과 버튼 */}
      <InterpretationContainer style={styles.buttonRow}>
        <Button title="✅ 알겠음" onPress={handleNext} />
        <Button title="❌ 모르겠음" onPress={handleNext} />
      </InterpretationContainer>
    </InterpretationContainer>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  number: { fontSize: 20, marginBottom: 10 },
  progress: { fontSize: 16, color: '#777', marginBottom: 10 },
  english: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  korean: { fontSize: 18, color: '#555', marginTop: 10, textAlign: 'center' },
  buttonGroup: { marginVertical: 20 },
  buttonRow: { flexDirection: 'row', gap: 20 },
});