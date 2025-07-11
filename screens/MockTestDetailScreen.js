// MockTestDetailScreen 컴포넌트
// - 모의고사 상세 정보를 보여주는 메인 컴포넌트입니다.
// - 연도, 월, 학년 정보에 따라 해당 모의고사의 세부 내용을 확인할 수 있습니다.
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function MockTestDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { year, month, grade } = route.params;

    const handleNavigate = (screen) => {
        navigation.navigate(screen, { year, month, grade });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📘 모의고사 상세 정보</Text>
            <Text style={styles.info}>🗓 {year}년 {month}월</Text>
            <Text style={styles.info}>🎓 {grade}학년</Text>

            <View style={styles.buttonContainer}>
                <Button title="1. 어휘" onPress={() => handleNavigate('VocabularySelectRange')} />
                <Button title="2. 해석" onPress={() => handleNavigate('InterpretationSelectNumber')} />
                <Button title="3. 주제 외우기" onPress={() => handleNavigate('Topic')} />
                <Button title="4. 어법 학습" onPress={() => handleNavigate('Grammar')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    info: { fontSize: 18, marginBottom: 10 },
    buttonContainer: { width: '100%', marginTop: 30, gap: 10 },
});