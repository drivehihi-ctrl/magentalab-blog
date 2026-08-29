import { getPost } from '../lib/wp';
import { supabaseAdmin } from '../lib/supabase-admin';
import { applyRevision } from '../lib/services/apply-service';

async function run() {
  try {
    const stagingPostId = 6798;
    const revisionId = 'rev_213c09f49ffa813e';

    console.log(`Fetching staging post ${stagingPostId}...`);
    const stagingPost = await getPost(stagingPostId.toString(), { noCache: true });
    if (!stagingPost) throw new Error('Staging post not found!');

    console.log(`Updating revision ${revisionId} with content from staging...`);
    const { error } = await supabaseAdmin
      .from('ai_revisions')
      .update({ new_content: stagingPost.content.rendered })
      .eq('revision_id', revisionId);

    if (error) throw error;

    console.log('Running live apply...');
    const result = await applyRevision({
      revision_id: revisionId,
      confirm: true,
      live_apply_confirm: true,
      source: 'agent_script'
    });

    console.log('Live apply SUCCESS!');
    console.log(result);

  } catch (e) {
    console.error('Live apply FAILED:', e);
  }
}

run();
