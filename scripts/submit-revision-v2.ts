import fs from 'fs';
import { createPendingRevision } from '../lib/services/revision-service';
import { reviewRevision } from '../lib/services/review-service';
import { stageRevision } from '../lib/services/staging-service';
import { getPost } from '../lib/wp';
import { supabaseAdmin } from '../lib/supabase-admin';

async function run() {
  try {
    const draftText = fs.readFileSync('draft_ckd_diet_article_v2.md', 'utf8');

    // Extract Sections
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
    const refRegex = /참고 자료 \d+ \(references\)\n?제목:\s*(.+)\n기관\/출처:\s*(.+)\n타입:\s*(.+)\nURL:\s*(.+)/g;
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
    contentHtml = contentHtml.replace(/^- (.+)$/gm, '<li>$1</li>');
    contentHtml = contentHtml.replace(/(<li>.+<\/li>\n)+/g, match => `<ul>\n${match}</ul>\n`);

    const wordpressId = 2167;
    
    // Reject previous revisions to avoid conflict
    await supabaseAdmin
      .from('ai_revisions')
      .update({ status: 'rejected' })
      .eq('wordpress_id', wordpressId)
      .neq('status', 'applied'); // keep applied ones

    // Get current WP post to get source_modified_at
    const post = await getPost(wordpressId.toString());
    if (!post) throw new Error('Post not found');
    const sourceModifiedAt = post.modified;

    console.log('Creating Revision...');
    const createResult = await createPendingRevision({
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
      reason: '긴급 수정 2 / TOP 10 재작성 반영',
    }, 'agent_script');
    
    const revisionId = createResult.revision.revision_id;
    console.log('Created Revision:', revisionId);

    console.log('Approving Revision...');
    await reviewRevision({
      revision_id: revisionId,
      decision: 'approve',
      reviewer_id: 'agent_script',
      reason: 'Auto-approve for staging',
      confirm: true,
      medical_review_confirm: true
    });

    console.log('Staging Revision...');
    const stageRes = await stageRevision({
      revision_id: revisionId,
      confirm: true,
      staging_apply_confirm: true,
      source: 'agent_script'
    });

    console.log('SUCCESS! Staging Draft ID:', stageRes.staging_post_id);
    console.log('Edit URL:', stageRes.edit_url);
    
  } catch (error) {
    console.error('FAILED:', error);
  }
}

run();
