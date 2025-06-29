import { NextRequest, NextResponse } from 'next/server';
import { ASO } from 'aso-v2';

export async function POST(request: NextRequest) {
  try {
    const appStore = new ASO('itunes');
    const body = await request.json();
    const { keywords } = body;
    
    // Validate keywords array
    if (!Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Invalid input. Keywords must be an array.' },
        { status: 400 }
      );
    }
    
    if (keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array cannot be empty.' },
        { status: 400 }
      );
    }
    
    // Validate each keyword is a non-empty string
    for (const keyword of keywords) {
      if (typeof keyword !== 'string' || keyword.trim() === '') {
        return NextResponse.json(
          { error: 'All keywords must be non-empty strings.' },
          { status: 400 }
        );
      }
    }

    // Process keywords sequentially
    const results = [];
    for (const keyword of keywords) {
      const analysis = await appStore.analyzeKeyword(keyword.trim());
      results.push({
        traffic_score: analysis.traffic.score,
        difficulty_score: analysis.difficulty.score
      });
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error analyzing keywords:', error);
    
    // Handle HTTP response errors from ASO-V2 library
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: { statusCode?: number } }).response;
      if (response && response.statusCode) {
        switch (response.statusCode) {
          case 503:
            return NextResponse.json(
              { error: 'App Store service temporarily unavailable. Please try again later.' },
              { status: 503 }
            );
          case 404:
            return NextResponse.json(
              { error: 'Keyword analysis not available' },
              { status: 404 }
            );
          case 429:
            return NextResponse.json(
              { error: 'Rate limit exceeded. Please try again later.' },
              { status: 429 }
            );
          default:
            return NextResponse.json(
              { error: `App Store API error: ${response.statusCode}` },
              { status: 502 }
            );
        }
      }
    }
    
    // Handle other errors
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Keyword analysis not available' },
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