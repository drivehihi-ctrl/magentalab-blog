import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wp';

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  if (!secret || !authHeader || !authHeader.startsWith('Bearer ')) return false;
  return authHeader.split(' ')[1] === secret;
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const limit = body.limit || 50;
    const language = body.language || 'ko';

    // 1. Fetch posts
    // Note: getPosts might need to accept limits or params, let's assume it gets recent posts.
    // We will simulate fetching specific language by filtering, or if WP API supports it.
    const allPostsResponse = await getPosts();
    const allPosts = allPostsResponse.posts;
    
    // Filter by language slug (very naive approach based on slug suffix)
    const filteredPosts = allPosts.filter(p => {
      const slug = p.slug || '';
      if (language === 'en') return slug.endsWith('-en');
      if (language === 'ja') return slug.endsWith('-ja');
      return !slug.endsWith('-en') && !slug.endsWith('-ja');
    }).slice(0, limit);

    const auditResults = [];

    let totals = {
      total: filteredPosts.length,
      green: 0,
      yellow: 0,
      red: 0,
      evidence_missing: 0,
      medical_review_required: 0
    };

    for (const post of filteredPosts) {
      const content = post.content?.rendered || '';
      
      const charCount = content.length;
      const h2Count = (content.match(/<h2/g) || []).length;
      const h3Count = (content.match(/<h3/g) || []).length;
      const tableCount = (content.match(/<table/g) || []).length;
      const imgCount = (content.match(/<img/g) || []).length;
      const missingAltCount = (content.match(/<img[^>]+alt=["']\s*["'][^>]*>|<img(?![^>]+alt=)[^>]*>/g) || []).length;
      
      const evidenceExists = content.includes('custom-vet-references') || content.includes('[근거]');
      const researchSummaryExists = content.includes("Ansim-i's Research Summary") || content.includes("Research Summary");
      
      const isMedicalTopic = post.slug.match(/diabetes|urinary|cystitis|patella|joint|poison|emergency|onion|garlic|chocolate|skin|dermatology|atopic|allergy/i) || content.match(/당뇨|인슐린|방광|신장|비뇨|슬개골|관절|탈구|골절|독성|응급|양파|초콜릿|피부|아토피|농피증/i);

      let qualityScore = 100;
      let adsenseRisk = 0;
      let evidenceScore = evidenceExists ? 100 : 0;
      let medicalRisk = isMedicalTopic ? 'high' : 'low';
      let status = 'green';
      const reasons = [];

      if (charCount < 1000) {
        qualityScore -= 20;
        adsenseRisk += 30;
        reasons.push("thin content");
      }
      if (h2Count < 2) {
        qualityScore -= 10;
        adsenseRisk += 10;
        reasons.push("weak structure");
      }
      if (isMedicalTopic && !evidenceExists) {
        qualityScore -= 30;
        adsenseRisk += 40;
        evidenceScore = 0;
        reasons.push("missing evidence");
        status = 'red';
        totals.evidence_missing++;
      }
      if (!researchSummaryExists) {
        qualityScore -= 10;
      }
      if (missingAltCount > 0) {
        qualityScore -= 5;
        reasons.push("missing alt tags");
      }

      if (status !== 'red') {
        if (adsenseRisk > 50 || qualityScore < 70) {
          status = 'yellow';
          totals.yellow++;
        } else {
          totals.green++;
        }
      } else {
        totals.red++;
      }

      if (isMedicalTopic) {
        totals.medical_review_required++;
      }

      auditResults.push({
        wordpress_id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        quality_score: qualityScore,
        adsense_risk: adsenseRisk,
        evidence_score: evidenceScore,
        medical_risk: medicalRisk,
        status: status,
        recommended_action: status === 'red' ? 'rewrite_with_evidence' : (status === 'yellow' ? 'enhance_structure' : 'none'),
        reason: reasons
      });
    }

    return NextResponse.json({
      summary: totals,
      posts: auditResults
    });

  } catch (error: any) {
    console.error("Error running audit:", error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
