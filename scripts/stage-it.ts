import { getPost } from '../lib/wp';
import { supabaseAdmin } from '../lib/supabase-admin';
import { stageRevision } from '../lib/services/staging-service';

async function run() {
  try {
    const revisionId = 'rev_5de08baba271a2a9';
    
    // 1. Get the current WP Post
    const post = await getPost('2167');
    if (!post) throw new Error('Post not found');
    const currentModifiedAt = post.modified;
    console.log('Current WP modified:', currentModifiedAt);

    // 2. Update revision's source_modified_at
    const { error } = await supabaseAdmin
      .from('ai_revisions')
      .update({ source_modified_at: currentModifiedAt })
      .eq('revision_id', revisionId);

    if (error) throw error;
    console.log('Updated revision source_modified_at');

    // 3. Stage
    console.log('Staging revision...');
    const result = await stageRevision({
      revision_id: revisionId,
      confirm: true,
      staging_apply_confirm: true,
      source: 'agent_script'
    });
    console.log('Staging successful!', JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('Failed:', e);
  }
}

run();
