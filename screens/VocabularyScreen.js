import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import fallbackWords from '../data/word_example100.json'; // 이름도 변경하면 좋음
import { View, Text, Button, StyleSheet } from 'react-native';

export default function VocabularyScreen() {

    const route = useRoute();
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [knownCount, setKnownCount] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);

    useEffect(() => {
        const paramWords = route.params?.words;
        const selectedRange = route.params?.range;

        const baseWords = Array.isArray(paramWords) && paramWords.length > 0 ? paramWords : fallbackWords;

        let filtered;
        if (selectedRange === '1-50') {
            filtered = baseWords.filter(word => word.number <= 50);
            
            console.log('선택된 범위:', filtered);
        } else if (selectedRange === '1-100') {
            filtered = baseWords; // 전체 다 사용
        } else {
            filtered = baseWords; // 기본은 전체
        }

        setWords(filtered);
        setIndex(0);
        setKnownCount(0);
        setShowMeaning(false);
        
    }, [route.params]);

    if (words.length === 0) {
        return (
            <View style={styles.container}>
                <Text>단어를 불러오는 중입니다...</Text>
            </View>
        );
    }
    
    const word = words[index];

    const handleKnow = () => {
        setKnownCount(knownCount + 1);
        nextWord();
    };

    const handleDontKnow = () => {
        nextWord();
    };

    const nextWord = () => {
        if (index < words.length - 1) {
            setIndex(index + 1);
            setShowMeaning(false);
        } else {
            alert(`회독 완료! 알고 있는 단어: ${knownCount} / ${words.length}`);
            setIndex(0);
            setKnownCount(0);
            setShowMeaning(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.number}>{index + 1} / {words.length}</Text>
            <Text style={styles.word}>{word.word}</Text>
            {showMeaning && (
                <View style={styles.meaningBox}>
                    <Text style={styles.meaning}>{word.meaning}</Text>
                </View>
            )}
            <Text style={styles.example}>{word.example}</Text>



            {showMeaning && (
                <View style={styles.meaningBox}>
                    <Text style={styles.exampleMeaning}>{word.examplemeaning}</Text>
                </View>
            )}
            <Button
                title={showMeaning ? "해석 숨기기" : "해석 보기"}
                onPress={() => setShowMeaning(!showMeaning)}
            />

            <View style={styles.buttonRow}>
                <Button title="✅ 알고 있음" onPress={handleKnow} />
                <Button title="❌ 모르겠음" onPress={handleDontKnow} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    number: { fontSize: 16, marginBottom: 10 },
    word: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
    meaningBox: { marginVertical: 20, alignItems: 'center' },
    meaning: { fontSize: 20, color: '#333', marginBottom: 10 },
    example: { fontSize: 16, fontStyle: 'italic' },
    exampleMeaning: { fontSize: 16, marginTop: 4, color: '#555' },
    buttonRow: { flexDirection: 'row', gap: 20 },
});