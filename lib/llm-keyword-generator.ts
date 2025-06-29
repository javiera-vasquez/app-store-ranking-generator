import Anthropic from '@anthropic-ai/sdk';
import { AppStoreApp, KeywordGeneratorResponse } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const KEYWORD_FUNCTION_TOOL = {
  name: "generate_app_keywords",
  description: "Generates relevant search keywords for app store optimization based on app data and screenshots",
  input_schema: {
    type: "object",
    properties: {
      keywords: {
        type: "array",
        items: {
          type: "string",
          description: "A relevant search keyword that users would likely use to find this app"
        },
        description: "Array of 15-20 highly relevant keywords for app store search optimization"
      }
    },
    required: ["keywords"]
  }
} as const;

type SupportedImageType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string, mediaType: SupportedImageType }> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect image format from Content-Type header or URL extension
    let mediaType: SupportedImageType = 'image/jpeg'; // default
    const contentType = response.headers.get('content-type');

    if (contentType) {
      if (contentType.includes('image/png')) {
        mediaType = 'image/png';
      } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
        mediaType = 'image/jpeg';
      } else if (contentType.includes('image/webp')) {
        mediaType = 'image/webp';
      } else if (contentType.includes('image/gif')) {
        mediaType = 'image/gif';
      }
    } else {
      // Fallback to URL extension
      if (imageUrl.toLowerCase().includes('.png')) {
        mediaType = 'image/png';
      } else if (imageUrl.toLowerCase().includes('.webp')) {
        mediaType = 'image/webp';
      } else if (imageUrl.toLowerCase().includes('.gif')) {
        mediaType = 'image/gif';
      }
    }

    return {
      base64: buffer.toString('base64'),
      mediaType
    };
  } catch (error) {
    console.error(`Error fetching image ${imageUrl}:`, error);
    throw new Error(`Failed to fetch image: ${imageUrl}`);
  }
}

interface GenerateKeywordsOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  minKeywords?: number;
}

export async function generateKeywords(
  appData: AppStoreApp,
  options: GenerateKeywordsOptions = {}
): Promise<KeywordGeneratorResponse> {
  if (!appData?.title || !appData?.description) {
    throw new Error('appData must include title and description');
  }

  if (!appData.screenshots || !Array.isArray(appData.screenshots)) {
    throw new Error('appData must include screenshots array');
  }

  const config = {
    model: options.model || 'claude-sonnet-4-20250514',
    maxTokens: options.maxTokens || 2000,
    temperature: options.temperature || 0.3,
    minKeywords: options.minKeywords || 15,
    ...options
  };

  const startTime = Date.now();

  try {
    console.log(`Generating keywords for: ${appData.title}`);


    const improvedPrompt = `Analyze this app and generate App Store Optimization (ASO) keywords that users would search to find it.

    App Details:
    - Title: ${appData.title}
    - Description: ${appData.description}
    - Categories: ${appData.genres.join(', ')}
    
    Guidelines for keyword generation:
    1. Extract keywords from the title, description, and visible text in screenshots
    2. Include both single words and 1-2 word phrases
    3. Consider user intent - what problems does this app solve?
    4. Include category-specific terms users would search
    5. Add action words (verbs) that describe what users can do with the app
    6. Include both high-competition popular terms AND low-competition long-tail keywords
    7. Avoid trademarked names unless they appear in the app's own title
    8. Focus on keywords with commercial intent
    
    Prioritize keywords by:
    - High relevance to core app functionality
    - Natural search phrases users would actually type
    - Mix of broad and specific terms
    
    Generate at least ${config.minKeywords} keywords, ordered by estimated value (considering both relevance and search potential).
    
    Note: The screenshots may contain additional features, UI elements, or use cases not mentioned in the text description.
    IMPORTANT: The keywords should be in the same language as the app title and description.
    IMPORTANT: Omit any url or website references, don't include any website or url in the keywords. don't try to fetch any website or url in the description, title or in the screenshots.
    IMPORTANT: Omit any +18 or adult content in the keywords.
    `;

    const content: Anthropic.MessageParam['content'] = [
      {
        type: "text",
        text: improvedPrompt
      }
    ];

    // Add screenshot images to the content (limit to first 4 for API efficiency)
    const screenshotsToProcess = appData.screenshots.slice(0, 4);
    for (const screenshotUrl of screenshotsToProcess) {
      try {
        const imageData = await fetchImageAsBase64(screenshotUrl);
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: imageData.mediaType,
            data: imageData.base64
          }
        });
      } catch (imageError) {
        console.warn(`Skipping image ${screenshotUrl}: ${imageError}`);
      }
    }

    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      tools: [KEYWORD_FUNCTION_TOOL],
      tool_choice: { type: "tool", name: "generate_app_keywords" }
    });

    const toolUse = response.content.find(content => content.type === 'tool_use');

    if (toolUse && toolUse.type === 'tool_use' && toolUse.name === 'generate_app_keywords') {
      const keywords = (toolUse.input as { keywords: string[] }).keywords;

      if (!Array.isArray(keywords) || keywords.length === 0) {
        throw new Error('No keywords generated');
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Generated ${keywords.length} keywords`);

      return {
        keywords: keywords,
        metadata: {
          appTitle: appData.title,
          keywordCount: keywords.length,
          model: config.model,
          generatedAt: new Date().toISOString()
        },
        performance: {
          durationMs: duration,
          keywordsPerSecond: Math.round((keywords.length / duration) * 1000)
        }
      };
    } else {
      throw new Error('No valid function call found in response');
    }

  } catch (error) {
    console.error('Error generating keywords:', error);

    if (error instanceof Error) {
      throw new Error(`Keyword generation failed: ${error.message}`);
    }

    throw new Error('Keyword generation failed: Unknown error');
  }
}

export function validateEnvironment(): boolean {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    return false;
  }

  if (process.env.ANTHROPIC_API_KEY.includes('your_actual_anthropic_api_key_here')) {
    console.error('❌ Please set a real ANTHROPIC_API_KEY in your .env file');
    return false;
  }

  return true;
}