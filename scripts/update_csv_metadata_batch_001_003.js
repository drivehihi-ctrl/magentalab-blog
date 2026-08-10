const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const result = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(field);
      if (row.length > 1) {
        result.push(row);
      }
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    result.push(row);
  }

  return result;
}

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

const batchMeta = [
  {
    content_id: '2451',
    task_order: '1 / 454',
    language: 'EN',
    slug: 'dog_diabetes_diet_insulin-en',
    category_main: '건강·질병',
    topic_cluster: '강아지 당뇨·대사',
    role: '핵심 하부',
    parent_hub: '상위 HUB 미확정',
    slug_decision: '유지 권장',
    action_decision: '단독 유지 / KO·JA 대응 세트',
    title: 'Canine Diabetes Management: 5 Things to Know About Insulin, Glucose Curves, Meals, and Hypoglycemia'
  },
  {
    content_id: '2370',
    task_order: '2 / 454',
    language: 'KO',
    slug: 'dog_diabetes_diet_insulin',
    category_main: '건강·질병',
    topic_cluster: '강아지 당뇨·대사',
    role: '핵심 하부',
    parent_hub: '상위 HUB 미확정',
    slug_decision: '유지 권장',
    action_decision: '단독 유지 / EN·JA 대응 세트',
    title: '강아지 당뇨병 관리 5가지: 인슐린, 혈당곡선, 식사와 저혈당 증상'
  },
  {
    content_id: '2457',
    task_order: '3 / 454',
    language: 'JA',
    slug: 'dog_diabetes_diet_insulin-ja',
    category_main: '건강·질병',
    topic_cluster: '강아지 당뇨·대사',
    role: '핵심 하부',
    parent_hub: '상위 HUB 미확정',
    slug_decision: '유지 권장',
    action_decision: '단독 유지 / KO·EN 대응 세트',
    title: '犬の糖尿病管理で知っておきたい5つのこと：インスリン・血糖曲線・食事・低血糖サイン'
  }
];

const csvPath = path.join(process.cwd(), 'magentalab_all_posts_454.csv');
if (fs.existsSync(csvPath)) {
  const content = fs.readFileSync(csvPath, 'utf8');
  let rows = parseCSV(content);
  let header = rows[0];

  // Clean BOM from header[0] if present
  header[0] = header[0].replace(/^\uFEFF/, '').trim();

  // Define standard columns
  const metaColumns = [
    'task_order',
    'content_id',
    'language',
    'slug',
    'category_main',
    'topic_cluster',
    'role',
    'parent_hub',
    'slug_decision',
    'action_decision',
    'title',
    'url'
  ];

  // Check if header needs expanding
  const newHeader = [...metaColumns];
  const updatedRows = [newHeader];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rowContentId = String(row[0] || '').trim();
    const metaMatch = batchMeta.find(m => m.content_id === rowContentId);

    if (metaMatch) {
      const newRow = [
        metaMatch.task_order,
        metaMatch.content_id,
        metaMatch.language,
        metaMatch.slug,
        metaMatch.category_main,
        metaMatch.topic_cluster,
        metaMatch.role,
        metaMatch.parent_hub,
        metaMatch.slug_decision,
        metaMatch.action_decision,
        metaMatch.title,
        row[6] || `https://www.magentalabblog.com/posts/${metaMatch.slug}`
      ];
      updatedRows.push(newRow);
    } else {
      // Preserve existing row mapped to new header layout
      const newRow = [
        '', // task_order
        row[0] || '', // content_id
        row[1] || '', // language
        row[2] || '', // slug
        '', // category_main
        '', // topic_cluster
        '', // role
        '', // parent_hub
        '', // slug_decision
        '', // action_decision
        row[3] || '', // title
        row[6] || ''  // url
      ];
      updatedRows.push(newRow);
    }
  }

  const newCsvContent = '\uFEFF' + updatedRows.map(r => r.map(escapeCsvField).join(',')).join('\n');
  fs.writeFileSync(csvPath, newCsvContent, 'utf8');
  console.log('✅ Successfully updated magentalab_all_posts_454.csv with classification metadata!');
}
