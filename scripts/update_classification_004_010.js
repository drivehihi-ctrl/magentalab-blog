const fs = require('fs');
const path = require('path');

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

function run() {
  const textFile = path.join(process.cwd(), 'Magentalab_2.0_작업순서_004-010_최종제작규칙_테스트.txt');
  const rawText = fs.readFileSync(textFile, 'utf8');
  
  const postRegex = /POST \d+ \/ 454[\s\S]*?={80}\s*([\s\S]*?)(?=={80}\s*POST|$)/g;
  let match;
  
  const classCsvPath = path.join(process.cwd(), 'magentalab_classification_454.csv');
  let csvContent = fs.readFileSync(classCsvPath, 'utf8');
  if (!csvContent.endsWith('\n')) {
    csvContent += '\n';
  }
  
  while ((match = postRegex.exec(rawText)) !== null) {
    const chunk = match[1];
    
    // Extract metadata
    const orderMatch = chunk.match(/- 작업순서:\s*(.*?)(?=\n)/);
    const idMatch = chunk.match(/- content_id:\s*(.*?)(?=\n)/);
    const langMatch = chunk.match(/- 언어:\s*(.*?)(?=\n)/);
    const slugMatch = chunk.match(/- 기존 slug:\s*(.*?)(?=\n)/);
    const catMatch = chunk.match(/- 대분류:\s*(.*?)(?=\n)/);
    const clusterMatch = chunk.match(/- 주제 클러스터:\s*(.*?)(?=\n)/);
    const roleMatch = chunk.match(/- 역할:\s*(.*?)(?=\n)/);
    const hubMatch = chunk.match(/- 상위 HUB:\s*(.*?)(?=\n)/);
    const slugJudgeMatch = chunk.match(/- slug 판단:\s*(.*?)(?=\n)/);
    const splitJudgeMatch = chunk.match(/- 통합·분리 판단:\s*(.*?)(?=\n)/);
    const titleMatch = chunk.match(/\[제목\]\s*([\s\S]*?)\[요약\]/);
    
    if (!idMatch) continue;
    
    const row = [
      orderMatch ? orderMatch[1].trim() : '',
      idMatch[1].trim(),
      langMatch ? langMatch[1].trim() : '',
      slugMatch ? slugMatch[1].trim() : '',
      catMatch ? catMatch[1].trim() : '',
      clusterMatch ? clusterMatch[1].trim() : '',
      roleMatch ? roleMatch[1].trim() : '',
      hubMatch ? hubMatch[1].trim() : '',
      slugJudgeMatch ? slugJudgeMatch[1].trim() : '',
      splitJudgeMatch ? splitJudgeMatch[1].trim() : '',
      titleMatch ? titleMatch[1].trim() : ''
    ];
    
    csvContent += row.map(escapeCsvField).join(',') + '\n';
  }
  
  fs.writeFileSync(classCsvPath, csvContent, 'utf8');
  console.log('✅ magentalab_classification_454.csv updated successfully!');
}

run();
