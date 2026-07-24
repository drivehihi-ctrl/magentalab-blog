import { NextRequest, NextResponse } from 'next/server';
import { getAIBriefingData } from '@/lib/map/aiBriefing';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json(
      { success: false, error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const briefing = await getAIBriefingData(query.trim());
    return NextResponse.json({
      success: true,
      briefing,
    });
  } catch (error) {
    console.error('Failed to fetch AI briefing:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
