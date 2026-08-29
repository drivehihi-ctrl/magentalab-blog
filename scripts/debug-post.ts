import { getPostBySlug } from '../lib/wp';
import { parseV3Content } from '../lib/utils/parse-v3-content';

async function run() {
  const post = await getPostBySlug("cat_nfe_carb_calculator", { noCache: true });
  if (!post) {
    console.log("Post not found");
    return;
  }
  
  const content = post.content.rendered;
  console.log("Content start:", content.substring(0, 500));
  
  const parsed = parseV3Content(content);
  console.log("Parsed result isV3:", parsed.isV3);
  
  const ansimRegex = /(?:<[^>]+>\s*)*\[안심이 요약 \(new_ansim_summary\)\](?:\s*<\/[^>]+>)*/;
  const evidenceRegex = /(?:<[^>]+>\s*)*\[검증된 근거 \(Evidence\)\](?:\s*<\/[^>]+>)*/;
  const contentRegex = /(?:<[^>]+>\s*)*\[본문 내용 \(Content\)\](?:\s*<\/[^>]+>)*/;
  
  console.log("has ansim:", ansimRegex.test(content));
  console.log("has evidence:", evidenceRegex.test(content));
  console.log("has content:", contentRegex.test(content));
}

run().catch(console.error);
