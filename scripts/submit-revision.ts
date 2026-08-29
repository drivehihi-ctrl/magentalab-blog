import fs from 'fs';
import { createPendingRevision } from '../lib/services/revision-service';

async function run() {
  try {
    const draftText = fs.readFileSync('draft_ckd_diet_article.md', 'utf8');

    // 1. Extract Sections
    const titleMatch = draftText.match(/^제목:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const ansimMatch = draftText.match(/\[안심이 요약 \(new_ansim_summary\)\]\n([\s\S]+?)\n\nF형 공감:/);
    const ansimSummary = ansimMatch ? ansimMatch[1].trim() : '';

    const excerptMatch = draftText.match(/F형 공감:\s*(.+)$/m);
    const excerpt = excerptMatch ? excerptMatch[1].trim() : '';

    const keyInsightMatch = draftText.match(/핵심 인사이트 \(keyInsight\):\s*(.+)$/m);
    const keyInsight = keyInsightMatch ? keyInsightMatch[1].trim() : '';

    const cautionMatch = draftText.match(/주의 사항 \(cautionNote\):\s*(.+)$/m);
    const cautionNote = cautionMatch ? cautionMatch[1].trim() : '';

    const references = [];
    const refRegex = /참고 자료 \d+ \(references\)\s*\n제목:\s*(.+)\n기관\/출처:\s*(.+)\n타입:\s*(.+)\nURL:\s*(.+)/g;
    let match;
    while ((match = refRegex.exec(draftText)) !== null) {
      references.push({
        title: match[1].trim(),
        org: match[2].trim(),
        type: match[3].trim(),
        url: match[4].trim(),
      });
    }

    const contentSplit = draftText.split(/\[본문 내용 \(Content\)\]\s*\n/);
    const rawContent = contentSplit[1] || '';

    let contentHtml = rawContent
      .replace(/^###\s*(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');

    const lines = contentHtml.split('\n');
    const processedLines = lines.map(line => {
      if (line.startsWith('<!--') || line.startsWith('<div') || line.startsWith('</div')) {
        return line;
      }
      if (line.trim() === '' || line.startsWith('<h') || line.startsWith('|') || line.startsWith('-')) {
        return line;
      }
      return `<p>${line.trim()}</p>`;
    });

    contentHtml = processedLines.join('\n').replace(/\n{2,}/g, '\n');

    contentHtml = contentHtml.replace(/\|(.+)\|\n\|[-|]+\|\n([\s\S]+?)(?=\n\n|\n<h|$)/g, (fullMatch) => {
      const rows = fullMatch.split('\n').filter(r => r.startsWith('|'));
      let table = '<table>\n';
      rows.forEach((row, idx) => {
        if (row.includes('---')) return;
        const cells = row.split('|').filter(c => c.trim() !== '');
        table += '<tr>' + cells.map(c => idx === 0 ? `<th>${c.trim()}</th>` : `<td>${c.trim()}</td>`).join('') + '</tr>\n';
      });
      table += '</table>';
      return table;
    });
    
    contentHtml = contentHtml.replace(/^- (.+)$/gm, '<li>$1</li>');
    contentHtml = contentHtml.replace(/(<li>.+<\/li>\n)+/g, match => `<ul>\n${match}</ul>\n`);

    console.log('--- Extracted Data ---');
    console.log('Title:', title);
    console.log('Excerpt:', excerpt);
    console.log('References Count:', references.length);
    console.log('Content Length:', contentHtml.length);
    console.log('----------------------');

    const wordpressId = 2167;
    const sourceModifiedAt = '2026-07-24T07:44:46';

    const result = await createPendingRevision({
      wordpress_id: wordpressId,
      source_modified_at: sourceModifiedAt,
      new_title: title,
      new_content: contentHtml,
      new_excerpt: excerpt,
      new_meta_description: excerpt,
      new_ansim_summary: ansimSummary,
      evidence: {
        keyInsight,
        cautionNote,
        references,
      },
      reason: '컨텐츠 고도화 (만성신장병 식단)',
    }, 'agent_script');

    console.log('SUCCESS! Revision created:', result.revision.revision_id);
    console.log('Preview URL:', `https://www.magentalabblog.com/preview/${result.revision.revision_id}`);
    
  } catch (error) {
    console.error('FAILED:', error);
  }
}

run();
