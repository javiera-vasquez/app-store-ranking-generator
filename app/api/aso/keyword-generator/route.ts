import { NextRequest, NextResponse } from 'next/server';
import { generateKeywords, validateEnvironment } from '@/lib/llm-keyword-generator';
import { KeywordGeneratorRequest, KeywordGeneratorApiResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<KeywordGeneratorApiResponse>> {
  try {
    // Validate environment setup
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API credentials' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: KeywordGeneratorRequest = await request.json();
    
    // Validate required fields
    if (!body.appData) {
      return NextResponse.json(
        { error: 'Invalid input. appData is required.' },
        { status: 400 }
      );
    }

    const { appData, options } = body;

    // Validate appData has required fields
    if (!appData.title || typeof appData.title !== 'string') {
      return NextResponse.json(
        { error: 'Invalid appData. title is required and must be a string.' },
        { status: 400 }
      );
    }

    if (!appData.description || typeof appData.description !== 'string') {
      return NextResponse.json(
        { error: 'Invalid appData. description is required and must be a string.' },
        { status: 400 }
      );
    }

    if (!appData.screenshots || !Array.isArray(appData.screenshots) || appData.screenshots.length === 0) {
      return NextResponse.json(
        { error: 'Invalid appData. screenshots array is required and must not be empty.' },
        { status: 400 }
      );
    }

    // Validate screenshot URLs
    for (const screenshot of appData.screenshots) {
      if (typeof screenshot !== 'string' || !screenshot.startsWith('http')) {
        return NextResponse.json(
          { error: 'Invalid appData. All screenshots must be valid URLs.' },
          { status: 400 }
        );
      }
    }

    console.log(`Processing keyword generation request for app: ${appData.title}`);

    // Generate keywords using the LLM service
    const result = await generateKeywords(appData, options);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in keyword generation endpoint:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Handle Anthropic API errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Authentication error: Invalid API credentials' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'Service quota exceeded. Please check your account.' },
          { status: 402 }
        );
      }

      // Handle validation errors
      if (error.message.includes('appData must include')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Handle image fetching errors
      if (error.message.includes('Failed to fetch image')) {
        return NextResponse.json(
          { error: 'Unable to process app screenshots. Please verify the image URLs are accessible.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}