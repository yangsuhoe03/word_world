const fs = require('fs');
const path = require('path');

const createMap = (dir, mapFileName) => {
  const files = fs.readdirSync(dir);
  let mapContent = 'export const problemFileMap = {\n';

  files.forEach(file => {
    if (path.extname(file) === '.pdf') {
      const key = file.replace('_problem.pdf', '').replace('.pdf', '');
      // For cross-platform compatibility, use forward slashes in the path
      const filePath = `../data/problems/${file}`.replace(/\\/g, '/');
      mapContent += `  '${key}': require('${filePath}'),\n`;
    }
  });

  mapContent += '};\n';
  fs.writeFileSync(mapFileName, mapContent, 'utf-8');
  console.log(`${mapFileName} created successfully.`);
};

const problemsDir = path.join(__dirname, 'data', 'problems');
const problemMapFile = path.join(__dirname, 'data', 'problemFileMap.js');
createMap(problemsDir, problemMapFile);

const createAnswerMap = (dir, mapFileName) => {
    const files = fs.readdirSync(dir);
    let mapContent = 'export const answerFileMap = {\n';

    files.forEach(file => {
        if (path.extname(file) === '.pdf') {
            const key = file.replace('_answer.pdf', '').replace('.pdf', '');
            const filePath = `../data/answers/${file}`.replace(/\\/g, '/');
            mapContent += `  '${key}': require('${filePath}'),\n`;
        }
    });

    mapContent += '};\n';
    fs.writeFileSync(mapFileName, mapContent, 'utf-8');
    console.log(`${mapFileName} created successfully.`);
}

const answersDir = path.join(__dirname, 'data', 'answers');
const answerMapFile = path.join(__dirname, 'data', 'answerFileMap.js');
createAnswerMap(answersDir, answerMapFile);
