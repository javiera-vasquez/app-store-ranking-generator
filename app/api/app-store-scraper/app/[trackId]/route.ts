import { NextRequest, NextResponse } from 'next/server';
import * as store from 'app-store-scraper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    
    // Validate trackId is numeric
    const numericTrackId = parseInt(trackId, 10);
    if (isNaN(numericTrackId)) {
      return NextResponse.json(
        { error: 'Invalid trackId. Must be a numeric value.' },
        { status: 400 }
      );
    }

    // Fetch app data from app-store-scraper
    const appData = await store.app({ id: numericTrackId });
    
    return NextResponse.json(appData);
  } catch (error) {
    console.error('Error fetching app data:', error);
    
    // Handle specific app-store-scraper errors
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('404')) {
        return NextResponse.json(
          { error: 'App not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}