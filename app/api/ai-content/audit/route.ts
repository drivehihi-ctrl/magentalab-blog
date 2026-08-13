import { NextResponse } from 'next/server';
import { getPost, getPosts } from '@/lib/wp';
import { auditRepository, evidenceRepository } from '@/lib/repositories';
import type { ContentAuditResult } from '@/lib/repositories/types';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { assessMedicalRisk } from '@/lib/medical-risk';

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function inferLanguage(slug: string): 'ko' | 'en' | 'ja' {
  if (slug.endsWith('-en')) return 'en';
  if (slug.endsWith('-ja')) return 'ja';
  return 'ko';
}

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const requestedLimit = Number(body.limit ?? 20);
    const limit = Math.max(1, Math.min(50, Number.isFinite(requestedLimit) ? Math.floor(requestedLimit) : 20));
    const requestedLanguage = String(body.language ?? 'ko');

    if (!['ko', 'en', 'ja'].includes(requestedLanguage)) {
      return NextResponse.json({ error: 'INVALID_LANGUAGE', message: 'language must be ko, en, or ja' }, { status: 400 });
    }
    const language = requestedLanguage as 'ko' | 'en' | 'ja';
    const requestId = crypto.randomUUID();

    const candidateResponse = await getPosts(1, limit, undefined, undefined, language);
    const candidates = candidateResponse.posts.slice(0, limit);
    const fullPosts = (await Promise.all(candidates.map(post => getPost(String(post.id))))).filter(Boolean);
    const auditResults: ContentAuditResult[] = [];

    const totals = {
      total: fullPosts.length,
      green: 0,
      yellow: 0,
      red: 0,
      evidence_missing: 0,
      medical_review_required: 0
    };

    for (const post of fullPosts) {
      if (!post) continue;

      const content = post.content?.rendered || '';
      const title = post.title?.rendered || '';
      const slug = post.slug || '';
      const postLanguage = inferLanguage(slug);
      const charCount = content.length;
      const h2Count = (content.match(/<h2\b/gi) || []).length;
      const h3Count = (content.match(/<h3\b/gi) || []).length;
      const tableCount = (content.match(/<table\b/gi) || []).length;
      const imgCount = (content.match(/<img\b/gi) || []).length;
      const missingAltCount = (content.match(/<img[^>]+alt=["']\s*["'][^>]*>|<img(?![^>]+alt=)[^>]*>/gi) || []).length;
      const researchSummaryExists = /Ansim-i['’]s Research Summary|Research Summary|안심이.*연구|研究まとめ|研究サマリー/i.test(content);
      const medicalAssessment = assessMedicalRisk(slug, title, content);
      const medicalTopic = medicalAssessment.isMedical;
      const evidence = await evidenceRepository.getByPostId(post.id);
      const evidenceExists = !!evidence && Array.isArray(evidence.references) && evidence.references.length > 0;

      let qualityScore = 100;
      let adsenseRisk = 0;
      const reasons: string[] = [];

      if (charCount < 1000) {
        qualityScore -= 20;
        adsenseRisk += 30;
        reasons.push('thin content');
      }
      if (h2Count < 2) {
        qualityScore -= 10;
        adsenseRisk += 10;
        reasons.push('weak structure');
      }
      if (tableCount < 1) {
        qualityScore -= 8;
        adsenseRisk += 5;
        reasons.push('missing summary table');
      }
      if (!researchSummaryExists) {
        qualityScore -= 10;
        reasons.push('missing research summary');
      }
      if (missingAltCount > 0) {
        qualityScore -= 5;
        reasons.push('missing alt tags');
      }
      if (medicalTopic && !evidenceExists) {
        qualityScore -= 30;
        adsenseRisk += 40;
        reasons.push('missing evidence');
        totals.evidence_missing++;
      }

      const structureScore = clampScore(100 - (h2Count < 2 ? 30 : 0) - (tableCount < 1 ? 25 : 0) - (!researchSummaryExists ? 20 : 0));
      const mediaScore = clampScore(100 - (imgCount === 0 ? 35 : 0) - (missingAltCount > 0 ? Math.min(40, missingAltCount * 10) : 0));
      const modifiedAt = new Date(post.modified).getTime();
      const ageDays = Number.isFinite(modifiedAt) ? Math.max(0, (Date.now() - modifiedAt) / 86_400_000) : 9999;
      const freshnessScore = clampScore(ageDays <= 180 ? 100 : ageDays <= 365 ? 80 : ageDays <= 730 ? 60 : 40);
      const evidenceScore = evidenceExists ? 100 : 0;
      const medicalRisk = medicalAssessment.score;
      const medicalRiskLevel = medicalAssessment.level;

      qualityScore = clampScore(qualityScore);
      adsenseRisk = clampScore(adsenseRisk);

      let status: 'green' | 'yellow' | 'red' = 'green';
      if (medicalTopic && !evidenceExists) {
        status = 'red';
      } else if (adsenseRisk > 50 || qualityScore < 70) {
        status = 'yellow';
      }

      if (status === 'red') totals.red++;
      else if (status === 'yellow') totals.yellow++;
      else totals.green++;
      if (medicalTopic) totals.medical_review_required++;

      auditResults.push({
        wordpress_id: post.id,
        content_id: String(post.id),
        language: postLanguage,
        title,
        slug,
        quality_score: qualityScore,
        adsense_risk: adsenseRisk,
        evidence_score: evidenceScore,
        medical_risk: medicalRisk,
        medical_risk_level: medicalRiskLevel,
        structure_score: structureScore,
        media_score: mediaScore,
        freshness_score: freshnessScore,
        status,
        recommended_action: status === 'red' ? 'rewrite_with_evidence' : status === 'yellow' ? 'enhance_structure' : 'none',
        reason: reasons,
        details: {
          title,
          slug,
          medical_risk_level: medicalRiskLevel,
          medical_signals: medicalAssessment.signals,
          evidence_exists: evidenceExists,
          char_count: charCount,
          h2_count: h2Count,
          h3_count: h3Count,
          table_count: tableCount,
          image_count: imgCount,
          missing_alt_count: missingAltCount,
          research_summary_exists: researchSummaryExists,
          reasons
        },
        request_id: requestId
      });
    }

    await auditRepository.saveAuditResults(auditResults);

    return NextResponse.json({
      request_id: requestId,
      summary: totals,
      posts: auditResults
    });
  } catch (error: any) {
    console.error('Error running audit:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
