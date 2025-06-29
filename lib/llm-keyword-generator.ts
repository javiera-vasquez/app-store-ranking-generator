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
        description: "Array of 10-15 highly relevant keywords for app store search optimization"
      }
    },
    required: ["keywords"]
  }
} as const;

async function fetchImageAsBase64(imageUrl: string): Promise<{base64: string, mediaType: string}> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Detect image format from Content-Type header or URL extension
    let mediaType = 'image/jpeg'; // default
    const contentType = response.headers.get('content-type');
    
    if (contentType) {
      if (contentType.includes('image/png')) {
        mediaType = 'image/png';
      } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
        mediaType = 'image/jpeg';
      } else if (contentType.includes('image/webp')) {
        mediaType = 'image/webp';
      }
    } else {
      // Fallback to URL extension
      if (imageUrl.toLowerCase().includes('.png')) {
        mediaType = 'image/png';
      } else if (imageUrl.toLowerCase().includes('.webp')) {
        mediaType = 'image/webp';
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
    model: options.model || 'claude-3-5-sonnet-20241022',
    maxTokens: options.maxTokens || 2000,
    temperature: options.temperature || 0.3,
    minKeywords: options.minKeywords || 15,
    ...options
  };

  const startTime = Date.now();

  try {
    console.log(`Generating keywords for: ${appData.title}`);
    
    const content: Anthropic.MessageParam['content'] = [
      {
        type: "text",
        text: `Analyze this app store data and generate the most relevant search keywords that users would likely use to find this app:

Title: ${appData.title}

Description: ${appData.description}

I'm also providing screenshots of the app store page. Using the information provided in the screenshots, and the description of the app, provide the most relevant search queries directly related to the app and the information provided in screenshots, title, subtitle and description. ensuring only keywords/search queries that would be exact search phrases derived from title, subtitle, app screenshots, and description. exclude long tail keywords, "* app" search phrases and any search phrases a user just wouldnt search, only keywords that are relevant to title, subtitle, screenshots, and description (if not matching context to all these elements then ignore), must have a relevancy score of atleast 95%. Please create at least ${config.minKeywords} keywords.

Use the generate_app_keywords function to return your response with the identified keywords.`
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