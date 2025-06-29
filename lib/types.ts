// App Store API Response Types

export interface AppStoreApp {
  id: number;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: string[];
  genreIds: number[];
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: string[];
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  releaseNotes?: string;
  version: string;
  price: number;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  developerWebsite?: string;
  score: number;
  reviews: number;
  currentVersionScore: number;
  currentVersionReviews: number;
  screenshots: string[];
  ipadScreenshots: string[];
  appletvScreenshots: string[];
  supportedDevices: string[];
}

export interface SimilarApp {
  id: number;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: string[];
  genreIds: number[];
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: string[];
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  version: string;
  price: number;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  score: number;
  reviews: number;
  currentVersionScore: number;
  currentVersionReviews: number;
  screenshots: string[];
  ipadScreenshots: string[];
  appletvScreenshots: string[];
  supportedDevices: string[];
}

export interface ApiError {
  error: string;
}

export interface ASOKeywordScores {
  difficulty: number;
  traffic: number;
}

export interface KeywordGeneratorRequest {
  appData: AppStoreApp;
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    minKeywords?: number;
  };
}

export interface KeywordGeneratorResponse {
  keywords: string[];
  metadata: {
    appTitle: string;
    keywordCount: number;
    model: string;
    generatedAt: string;
  };
  performance?: {
    durationMs: number;
    keywordsPerSecond: number;
  };
}

export type AppStoreApiResponse = AppStoreApp | ApiError;
export type SimilarAppsApiResponse = SimilarApp[] | ApiError;
export type ASOKeywordScoresApiResponse = ASOKeywordScores | ApiError;
export type KeywordGeneratorApiResponse = KeywordGeneratorResponse | ApiError;