import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import words from '../data/word_sample.json';

export default function VocabularyScreen() {
    const [index, setIndex] = useState(0);
    const [knownCount, setKnownCount] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);

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

    const word = words[index];

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