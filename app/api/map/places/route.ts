import { NextRequest, NextResponse } from 'next/server';
import { getPetPlaces } from '@/lib/map/places';
import { PetCategory } from '@/lib/map/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'all') as PetCategory | 'all';
  const query = searchParams.get('q') || '';

  try {
    const places = getPetPlaces({
      category,
      searchQuery: query,
    });

    return NextResponse.json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    console.error('Failed to fetch POI places:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
