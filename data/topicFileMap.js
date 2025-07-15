// 이 파일은 연도, 월, 학년별로 주제(topic) 데이터 파일을 매핑합니다.
// 추후 여러 파일이 추가될 경우 아래 객체에 추가하면 됩니다.

export const topicFileMap = {
  // 예시: 2025_03_1: require('./topic_example.json'),
  '2025_03_1': require('./topic/2025_03_1_topic.json'),
  // 추가 파일은 아래와 같이 작성
  // '2025_06_2': require('./topic_2025_06_2.json'),
}; 