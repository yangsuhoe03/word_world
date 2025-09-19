import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { answerFileMap } from '../data/answerFileMap';

const ExplanationScreen = ({ route }) => {
  const { year, month, grade } = route.params;

  // 1. route.params로 받은 값으로 answerFileMap의 키를 생성
  //    '03', '06'처럼 만들어야 하니 month에 padStart를 사용
  const key = `${year}_${String(month).padStart(2, '0')}_${grade}`;
  console.log('Generated Key:', key);

  // 2. 생성된 키로 맵에서 PDF 소스를 찾는다
  const pdfSource = answerFileMap[key];
  console.log('PDF Source from map:', pdfSource);

  // 3. 만약 해당하는 PDF 파일이 없으면 에러 메시지를 보여준다 (중요!)
  if (!pdfSource) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          해당하는 문제지 PDF 파일을 찾을 수 없습니다.
        </Text>
        <Text style={styles.details}>
          요청: {year}년 {month}월 {grade}학년
        </Text>
      </View>
    );
  }

  // 4. PDF 파일이 있으면 뷰어로 보여준다
  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false} // Android에서 https 관련 경고를 무시할지 여부
        source={pdfSource}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF 로딩 완료: ${numberOfPages} 페이지`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width, // 화면 너비에 꽉 채우기
    height: Dimensions.get('window').height, // 화면 높이에 꽉 채우기
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default ExplanationScreen;