// VocabularySelectRangeScreen 컴포넌트
// - 단어 암기 연습 범위 선택 화면의 메인 컴포넌트입니다.
// - 사용자가 원하는 단어 범위를 선택하면 해당 범위의 단어 암기 화면으로 이동합니다.
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wordFileMap } from '../data/wordFileMap.js';
import fallbackData from '../data/word_example100.json';

export default function VocabularySelectRangeScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { year, month, grade } = route.params || {};

    const [wordList, setWordList] = useState(null);

    useEffect(() => {
        const key = `${year}_${String(month).padStart(2, '0')}_${grade}`; // ex: 2024_03_3
        const data = wordFileMap[key];
        
    console.log('키:', key, '데이터:', data);
        if (data && Array.isArray(data)) {
            setWordList(data);
        } else {
            console.warn(`${key}_word.js 파일이 없어 기본 단어로 대체합니다.`);
            setWordList(fallbackData);
        }
    }, [year, month, grade]);
    const handleSelectRange = (range) => {
        if (!wordList) {
            Alert.alert('단어 데이터를 불러오는 중입니다.');
            return;
        }

        navigation.navigate('Vocabulary', {
            range,
            words: wordList,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>어휘 회독 범위를 선택하세요</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleSelectRange('1-50')}>
                <Text style={styles.buttonText}>1 ~ 50번</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSelectRange('1-100')}>
                <Text style={styles.buttonText}>1 ~ 100번</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 20 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginVertical: 10 },
    buttonText: { color: 'white', fontSize: 16 },
});