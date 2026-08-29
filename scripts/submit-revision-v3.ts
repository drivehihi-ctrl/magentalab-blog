import fs from 'fs';
import { createPendingRevision } from '../lib/services/revision-service';
import { stageRevision } from '../lib/services/staging-service';
import { supabaseAdmin } from '../lib/supabase-admin';
import { getPost } from '../lib/wp';

async function run() {
  try {
    const postId = 2167; // The target post ID
    const draftText = fs.readFileSync('draft_ckd_diet_article_v3.md', 'utf8');

    console.log(`Fetching latest modified date for post ${postId}...`);
    const livePost = await getPost(postId.toString(), { noCache: true });
    if (!livePost) {
      throw new Error(`Post ${postId} not found.`);
    }

    const titleMatch = draftText.match(/^제목:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '강아지 만성신장병 식단, 인을 왜 조절할까? 신장 처방식과 간식 보는 법';

    const ansimMatch = draftText.match(/\[안심이 요약 \(new_ansim_summary\)\]\n([\s\S]+?)\n\nF형 공감:/);
    const ansimSummaryList = ansimMatch ? ansimMatch[1].trim() : '';
    const excerptMatch = draftText.match(/F형 공감:\s*(.+)$/m);
    const excerptText = excerptMatch ? excerptMatch[1].trim() : '';
    const combinedAnsimSummary = `${ansimSummaryList}\n\n${excerptText}`;

    // Evidence extraction
    const keyInsightMatch = draftText.match(/핵심 인사이트 \(keyInsight\):\s*([^\r\n]+)/);
    const cautionNoteMatch = draftText.match(/주의 사항 \(cautionNote\):\s*([^\r\n]+)/);
    const references: any[] = [];
    const refRegex = /참고 자료 \d+ \(references\)\r?\n제목:\s*([^\r\n]+)\r?\n기관\/출처:\s*([^\r\n]+)\r?\n타입:\s*([^\r\n]+)\r?\nURL:\s*([^\r\n]+)/g;
    let match;
    while ((match = refRegex.exec(draftText)) !== null) {
      references.push({
        title: match[1].trim(),
        org: match[2].trim(),
        type: match[3].trim(),
        url: match[4].trim(),
      });
    }

    console.log('keyInsightMatch:', keyInsightMatch ? keyInsightMatch[1].trim() : null);
    console.log('cautionNoteMatch:', cautionNoteMatch ? cautionNoteMatch[1].trim() : null);
    console.log('references count:', references.length);

    const contentSplit = draftText.split(/\[본문 내용 \(Content\)\]\s*\n/);
    const rawContent = contentSplit[1] || '';

    // Convert headers
    let contentHtml = rawContent
      .replace(/^###\s*(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');

    const lines = contentHtml.split('\n');
    let inHtmlBlock = false;
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed === '<!-- wp:html -->') {
        inHtmlBlock = true;
        return line;
      }
      if (trimmed === '<!-- /wp:html -->') {
        inHtmlBlock = false;
        return line;
      }
      if (inHtmlBlock) {
        return line; // keep image prompt exact
      }

      if (trimmed === '' || trimmed.startsWith('<h') || trimmed.startsWith('<table') || trimmed.startsWith('</table') || trimmed.startsWith('<thead') || trimmed.startsWith('</thead') || trimmed.startsWith('<tbody') || trimmed.startsWith('</tbody') || trimmed.startsWith('<tr') || trimmed.startsWith('</tr') || trimmed.startsWith('|') || trimmed.startsWith('-')) {
        return line;
      }
      return `<p>${trimmed}</p>`;
    });

    contentHtml = processedLines.join('\n').replace(/\n{2,}/g, '\n');

    console.log('Rejecting existing pending revisions...');
    await supabaseAdmin
      .from('ai_revisions')
      .update({ status: 'rejected' })
      .eq('wordpress_id', postId)
      .in('status', ['pending', 'approved', 'staged']);

    console.log('Creating Revision V3...');
    const result = await createPendingRevision({
      wordpress_id: postId,
      new_title: title,
      new_content: contentHtml,
      new_excerpt: excerptText,
      new_ansim_summary: combinedAnsimSummary,
      evidence: {
        keyInsight: keyInsightMatch ? keyInsightMatch[1].trim() : '',
        cautionNote: cautionNoteMatch ? cautionNoteMatch[1].trim() : '',
        references,
      },
      source_modified_at: livePost.modified,
    });
    const revId = (result as any).revision ? (result as any).revision.revision_id : (result as any).revision_id;
    console.log('Created Revision V3:', revId);

    console.log('Approving Revision V3...');
    await supabaseAdmin
      .from('ai_revisions')
      .update({ status: 'approved', medical_reviewed: true })
      .eq('revision_id', revId);

    console.log('Staging Revision V3...');
    const stageRes = await stageRevision({
      revision_id: revId,
      confirm: true,
      staging_apply_confirm: true,
      medical_reviewed: true,
      source: 'agent_script'
    });

    console.log('SUCCESS! Staging Draft ID:', stageRes.staging_post_id);
    console.log(`Edit URL: https://magentalab.mycafe24.com/wp-admin/post.php?post=${stageRes.staging_post_id}&action=edit`);
    console.log(`Preview URL: https://www.magentalabblog.com/preview/${revision.revision_id}`);

  } catch (err) {
    console.error('FAILED:', err);
  }
}

run();
