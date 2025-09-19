const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFilePath = path.join(__dirname, "word_template.csv");
const outputFilePath = path.join(__dirname, "./data/word/2025_03_1_word.json");

const results = [];

fs.createReadStream(inputFilePath)
.pipe(csv())
.on("data", (data) => {
console.log("첫 data 객체의 키:", Object.keys(data));

  
results.push({
    year: parseInt(data.year, 10),
    month: parseInt(data.month, 10),
    grade: parseInt(data.grade, 10),
    number: parseInt(data.number, 10),
    questionnumber: parseInt(data.questionnumber, 10),
    word: data.word.trim(),
    meaning: data.meaning.trim(),
    example: data.example.trim(),
    examplemeaning: data.examplemeaning.trim(),
    isKnown: false, // 기본값 false로 설정
});
})
.on("end", () => {
fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2), "utf-8");
console.log(`✅ 변환 완료: ${outputFilePath}`);
});