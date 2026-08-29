import fs from 'fs';
import { supabaseAdmin } from '../lib/supabase-admin';
import { stageRevision } from '../lib/services/staging-service';
import { getPost } from '../lib/wp';

async function run() {
  try {
    const revisionId = 'rev_803d71bdf6b1144f';
    const draftText = fs.readFileSync('draft_ckd_diet_article_v2.md', 'utf8');

    // Fix 1: ansim_summary must include the empathy text at the bottom for the preview to work
    const ansimMatch = draftText.match(/\[안심이 요약 \(new_ansim_summary\)\]\n([\s\S]+?)\n\nF형 공감:/);
    const ansimSummaryList = ansimMatch ? ansimMatch[1].trim() : '';
    const excerptMatch = draftText.match(/F형 공감:\s*(.+)$/m);
    const excerpt = excerptMatch ? excerptMatch[1].trim() : '';
    const combinedAnsimSummary = `${ansimSummaryList}\n\n${excerpt}`;

    // Fix 2: Properly parse the HTML so we don't inject <p> tags inside the wp:html blocks
    const contentSplit = draftText.split(/\[본문 내용 \(Content\)\]\s*\n/);
    const rawContent = contentSplit[1] || '';

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
        // Keep everything inside wp:html block EXACTLY as is, no <p> wrapping!
        return line;
      }

      // Outside html block:
      if (trimmed === '' || trimmed.startsWith('<h') || trimmed.startsWith('|') || trimmed.startsWith('-')) {
        return line;
      }
      return `<p>${trimmed}</p>`;
    });

    contentHtml = processedLines.join('\n').replace(/\n{2,}/g, '\n');
    contentHtml = contentHtml.replace(/^- (.+)$/gm, '<li>$1</li>');
    contentHtml = contentHtml.replace(/(<li>.+<\/li>\n)+/g, match => `<ul>\n${match}</ul>\n`);

    console.log('Updating database...');
    const { error } = await supabaseAdmin
      .from('ai_revisions')
      .update({
        new_ansim_summary: combinedAnsimSummary,
        new_content: contentHtml
      })
      .eq('revision_id', revisionId);

    if (error) throw error;
    console.log('Database updated successfully.');

    // We must re-stage the revision so WP gets the new content
    console.log('Re-staging revision...');
    const stageRes = await stageRevision({
      revision_id: revisionId,
      confirm: true,
      staging_apply_confirm: true,
      source: 'agent_script'
    });

    console.log('SUCCESS! Staging Draft ID:', stageRes.staging_post_id);

  } catch (err) {
    console.error('FAILED:', err);
  }
}

run();
