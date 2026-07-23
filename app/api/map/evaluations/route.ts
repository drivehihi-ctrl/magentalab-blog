import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory fallback cache if Supabase table is not yet created
const memoryEvaluations: Record<string, Array<{ score: number; answers: Record<string, boolean>; userId: string }>> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'placeId is required' }, { status: 400 });
  }

  try {
    // Try fetching from Supabase table 'place_evaluations'
    const { data, error } = await supabase
      .from('place_evaluations')
      .select('score, answers')
      .eq('place_id', placeId);

    if (!error && data && data.length > 0) {
      const totalCount = data.length;
      const avgScore = Math.round(data.reduce((acc, cur) => acc + (cur.score || 0), 0) / totalCount);

      return NextResponse.json({
        placeId,
        averageScore: avgScore,
        totalEvaluations: totalCount,
      });
    }
  } catch (e) {
    // Fallback to in-memory store
  }

  // Check in-memory store
  const localList = memoryEvaluations[placeId] || [];
  if (localList.length > 0) {
    const totalCount = localList.length;
    const avgScore = Math.round(localList.reduce((acc, cur) => acc + cur.score, 0) / totalCount);
    return NextResponse.json({
      placeId,
      averageScore: avgScore,
      totalEvaluations: totalCount,
    });
  }

  return NextResponse.json({
    placeId,
    averageScore: null,
    totalEvaluations: 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { placeId, score, answers, userId } = body;

    if (!placeId || score === undefined) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Save to in-memory store first
    if (!memoryEvaluations[placeId]) {
      memoryEvaluations[placeId] = [];
    }
    memoryEvaluations[placeId].push({ score, answers, userId: userId || 'anonymous' });

    // Save to Supabase table 'place_evaluations' if configured
    try {
      await supabase.from('place_evaluations').insert([
        {
          place_id: placeId,
          score,
          answers,
          user_id: userId || 'anonymous',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      // Ignore table missing error
    }

    const localList = memoryEvaluations[placeId];
    const avgScore = Math.round(localList.reduce((acc, cur) => acc + cur.score, 0) / localList.length);

    return NextResponse.json({
      success: true,
      placeId,
      averageScore: avgScore,
      totalEvaluations: localList.length,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
