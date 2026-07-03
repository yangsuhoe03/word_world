// 이 화면은 사용자가 단어 학습 범위를 선택할 수 있도록 도와주는 화면입니다. 예를 들어, 특정 범위의 단어만 골라서 학습할 수 있습니다.
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler, Button, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wordFileMap } from '../data/wordFileMap.js';
import { useFocusEffect } from '@react-navigation/native';
import fallbackData from '../data/word_example100.json';
import Container from '../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VocabularySelectRangeScreen({route, navigation}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReviewTimes, setSelectedReviewTimes] = useState([]);
    const [selectedRangeLabel, setSelectedRangeLabel] = useState('');
    // const navigation = useNavigation(); // 화면 이동을 위한 네비게이션 객체
    // const route = useRoute(); // 라우트 파라미터 접근
    // const { year, month, grade } = route.params || {}; // 전달받은 연도, 월, 학년
    const year = route.params.year;
    //console.log('year', route);
    //console.log('year', route.params);
    const month = route.params.month;
    const grade = route.params.grade;

    const [wordList, setWordList] = useState(null); // 단어 리스트 상태
    const [reviewInfo, setReviewInfo] = useState({});

    useEffect(() => {
        const fetchReviewInfo = async () => {
            try {
                const data = await AsyncStorage.getItem('reviewInfo');
                const parsed = data ? JSON.parse(data) : {};
                setReviewInfo(parsed);
                console.log('reviewInfo', parsed);
            } catch (e) {
                console.error('회독 정보 불러오기 실패:', e);
            }
        };
        fetchReviewInfo();

    }, []);

    useEffect(() => {
        // key 예시: 2024_03_3
        const key = `${year}_${String(month).padStart(2, '0')}_${grade}`; // 파일명 규칙에 맞게 key 생성
        const data = wordFileMap[key]; // 해당 key로 단어 데이터 찾기
        
        if (data && Array.isArray(data)) {
            setWordList(data); // 데이터가 있으면 세팅
        } else {
            console.warn(`${key}_word.js 파일이 없어 기본 단어로 대체합니다.`);
            setWordList(fallbackData); // 없으면 fallback 데이터 사용
        }
    }, [year, month, grade]);

    // 범위 선택 시 단어 리스트와 함께 Vocabulary 화면으로 이동
    const handleSelectRange = (range) => {
        if (!wordList) {
            Alert.alert('단어 데이터를 불러오는 중입니다.');
            return;
        }

        navigation.navigate('Vocabulary', {
            range,
            words: wordList,
            year,
            month,
            grade
        });
    };



    // 전체 reviewInfo 삭제
    const clearReviewInfo = async () => {
        try {
            await AsyncStorage.removeItem('reviewInfo');
            setReviewInfo({});
            Alert.alert('저장된 회독 정보가 삭제되었습니다.');
        } catch (e) {
            console.error('회독 정보 삭제 실패:', e);
        }
    };

    // 범위 목록 정의
    const ranges = [
        { label: '1 ~ 50번', value: '1-50' },
        { label: '1 ~ 100번', value: '1-100' },
        // 앞으로 범위가 추가될 경우 여기에 추가
    ];

    const key = `${year}_${String(month).padStart(2, '0')}_${grade}`;
    const infoForKey = reviewInfo[key] || {};

    return (
        <Container style={styles.container}>
            <Text style={styles.title}>어휘 회독 범위를 선택하세요</Text>
            {ranges.map((rangeObj, index) => {
                const rangeData = infoForKey[rangeObj.value];
                const reviewCount = (rangeData?.reviewTimes?.length || 0) + 1;
                const rangeLabel = `No. ${rangeObj.label.replace('번', '').replace(' ~ ', ' ~ ')}`;

                return (
                    <TouchableOpacity
                        key={rangeObj.value}
                        style={styles.sessionButton}
                        onPress={() => handleSelectRange(rangeObj.value)}
                    >
                        <View style={styles.sessionHeader}>
                            <Text style={styles.sessionTitle}>Session {index + 1}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedReviewTimes(rangeData && rangeData.reviewTimes ? rangeData.reviewTimes : []);
                                    setSelectedRangeLabel(rangeObj.label);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.historyIcon}>☰</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.reviewCountText}>{reviewCount}회독</Text>
                        <Text style={styles.rangeLabelText}>{rangeLabel}</Text>
                    </TouchableOpacity>
                );
            })}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <View style={{backgroundColor:'#333', padding:24, borderRadius:16, minWidth:280}}>
                        <Text style={{color:'#fff', fontSize:18, marginBottom:12}}>{selectedRangeLabel} 회독 기록</Text>
                        {selectedReviewTimes.length === 0 ? (
                            <Text style={{color:'#fff'}}>회독 기록이 없습니다.</Text>
                        ) : (
                            selectedReviewTimes.map((t, idx) => (
                                <Text key={idx} style={{color:'#fff', fontSize:15, marginBottom:4}}>
                                    {idx+1}회독: {Math.floor(t.seconds/60)}분 {t.seconds%60}초 ({t.date})
                                </Text>
                            ))
                        )}
                        <Button title="닫기" onPress={() => setModalVisible(false)} color="#4CAF50" />
                    </View>
                </View>
            </Modal>
            {/* 회독 정보 초기화 버튼 */}
            <TouchableOpacity style={[styles.resetButton]} onPress={clearReviewInfo}>
                <Text style={styles.resetButtonText}>회독 정보 초기화</Text>
            </TouchableOpacity>
        </Container>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 20 },
    sessionButton: {
        backgroundColor: '#78BFB8',
        borderRadius: 0,
        padding: 20,
        width: '60%',
        marginVertical: 30,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sessionTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    historyIcon: {
        color: 'white',
        fontSize: 24,
    },
    reviewCountText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'normal',
        textAlign: 'center',
        marginVertical: 5,
    },
    rangeLabelText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    resetButton: {
        backgroundColor: 'red',
        borderRadius: 15,
        padding: 15,
        width: '80%',
        marginVertical: 10,
    },
    resetButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
