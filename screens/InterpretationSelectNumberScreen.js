import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { interpretationFileMap } from '../data/interpretationFileMap.js';
// 이 화면은 사용자가 해석(문장 해석) 문제의 번호를 선택할 수 있도록 해주는 화면입니다. 원하는 문제 번호를 선택하여 해석 학습을 시작할 수 있습니다.

// 파일 내 컨테이너 컴포넌트 정의
function InterpretationSelectNumberContainer(props) {
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

export default function InterpretationSelectNumber({route, navigation}) {
    const year = route.params.year;
    const month = route.params.month;
    const grade = route.params.grade;

    const [interpretationData, setInterpretationData] = useState(null);

    useEffect(() => {
        // key 예시: 2024_03_3
        const key = `${year}_${String(month).padStart(2, '0')}_${grade}`; // 파일명 규칙에 맞게 key 생성
        const data = interpretationFileMap[key]; // 해당 key로 해석 데이터 찾기
        setInterpretationData(data);
    }, [year, month, grade]);

  // 문제 번호 선택 시 Interpretation 화면으로 이동
  const handleSelect = (number) => {
    navigation.navigate('Interpretation', {
      number,
      interpretations: interpretationData,
    });
  };

  // 문제 번호 버튼 배열 생성 (41-42, 43-45는 묶어서 표시)
  const problemButtons = [];
  for (let i = 1; i <= 45; i++) {
    if (i === 41) {
      problemButtons.push("41-42");
      i = 42;
    } else if (i === 43) {
      problemButtons.push("43-45");
      break;
    } else {
      problemButtons.push(i.toString());
    }
  }

  return (
    <InterpretationSelectNumberContainer style={styles.container} scroll>
      <Text style={styles.title}>해석할 문제 번호를 선택하세요</Text>
      <InterpretationSelectNumberContainer style={styles.grid}>
        {/* 문제 번호 버튼 렌더링 */}
        {problemButtons.map(number => (
          <TouchableOpacity key={number} style={styles.button} onPress={() => handleSelect(number)}>
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </InterpretationSelectNumberContainer>
    </InterpretationSelectNumberContainer>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    margin: 6,
    minWidth: 60,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16 }
});