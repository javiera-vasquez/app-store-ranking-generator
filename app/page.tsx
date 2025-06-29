'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppCard } from '@/components/app-card';
import { AppCardSkeleton } from '@/components/app-card-skeleton';

type AppData = {
  title: string;
  icon: string;
  primaryGenre: string;
  keywords: string[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSimilarAppsLoading, setIsSimilarAppsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  
  const [appData, setAppData] = useState<AppData | null>(null);
  const [similarApps, setSimilarApps] = useState<Array<AppData>>([]);
  const [trackId, setTrackId] = useState<string>('');

  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Reset all states
    setAppData(null);
    setSimilarApps([]);
    setError(null);

    if (!trackId || trackId.trim() === '') {
      console.error('Track ID is required, please add a trackId');
      return;
    }
    
    const trackIdNumber = Number(trackId);

    if (isNaN(trackIdNumber)) {
      console.error('Track ID must be a valid number');
      setError('Track ID must be a valid number');
      return;
    }

    setIsLoading(true);

    try {
      // Phase 1: Get main app data and display immediately
      const getAppData = await fetch(`http://localhost:3000/api/app-store-scraper/app/${trackIdNumber}`);
      const appDataResponse = await getAppData.json();

      if (appDataResponse) {
        // Generate keywords for main app
        const mainAppKeywordResponse = await fetch('http://localhost:3000/api/aso/keyword-generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appData: {
              title: appDataResponse.title,
              description: appDataResponse.description,
              genres: appDataResponse.genres,
              screenshots: appDataResponse.screenshots,
            }
          })
        });

        const mainAppKeywords = await mainAppKeywordResponse.json();
        
        // Set main app data immediately
        setAppData({
          ...appDataResponse, 
          keywords: mainAppKeywords?.keywords || []
        });
        setIsLoading(false);
        
        // Phase 2: Load similar apps in background
        setIsSimilarAppsLoading(true);
        
        try {
          // Get similar apps
          const getSimilarApps = await fetch(`http://localhost:3000/api/app-store-scraper/similar/${trackIdNumber}`);
          const similarAppsResponse = await getSimilarApps.json();

          console.log('Similar Apps:', similarAppsResponse);

          // Get top 3 similar apps data
          const top3SimilarApps = similarAppsResponse.slice(0, 3);
          const similarAppsData = await Promise.all(
            top3SimilarApps.map(async (app: any) => {
              const response = await fetch(`http://localhost:3000/api/app-store-scraper/app/${app.id}`);
              return response.json();
            })
          );

          // Generate keywords for similar apps
          const similarAppsKeywordResults = await Promise.all(
            similarAppsData.map(async (app) => {
              const response = await fetch('http://localhost:3000/api/aso/keyword-generator', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  appData: {
                    title: app.title,
                    description: app.description,
                    genres: app.genres,
                    screenshots: app.screenshots,
                  }
                })
              });

              const data = await response.json();
              if (!response.ok) {
                console.error('Keyword generation failed for app:', app.title, data);
                return null;
              }
              return data;
            })
          );

          setSimilarApps(
            similarAppsData.map((app, idx) => ({
              ...app, 
              keywords: similarAppsKeywordResults[idx]?.keywords || []
            }))
          );

          setIsSimilarAppsLoading(false);

          // Get ASO scores for first 3 keywords of main app
          if (mainAppKeywords?.keywords) {
            const mainAppKeywordsList = mainAppKeywords.keywords.slice(0, 15);
            console.log('Analyzing first 3 keywords of main app:', mainAppKeywordsList);
            
            const keywordScoresResponse = await fetch('http://localhost:3000/api/aso/keyword-scores/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                keywords: mainAppKeywordsList
              })
            });

            if (keywordScoresResponse.ok) {
              const keywordScores = await keywordScoresResponse.json();
              
              // Combine keywords with their scores for better comprehension
              const keywordsWithScores = mainAppKeywordsList.map((keyword, index) => ({
                keyword: keyword,
                traffic_score: keywordScores[index]?.traffic_score || 0,
                difficulty_score: keywordScores[index]?.difficulty_score || 0
              }));
              
              console.log('ASO Keywords with Scores:', keywordsWithScores);
            } else {
              console.error('Failed to get keyword scores:', await keywordScoresResponse.json());
            }
          }
        } catch (similarAppsError) {
          console.error('Failed to load similar apps:', similarAppsError);
        } 
      }
    } catch (error) {
      setError('Request failed, please try again');
      console.error('Request failed:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">AI Store Ranking Generator</h1>
              <p className="text-muted-foreground">Generate ASO keywords for your app</p>
            </div>

            <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="trackId" className="text-sm font-medium">
                      App Track ID
                    </label>
                    <div className="flex gap-2">
                      <Input 
                        id="trackId"
                        type="number" 
                        placeholder="e.g. 1520555361" 
                        value={trackId} 
                        onChange={(e) => setTrackId(e.target.value)}
                        className="flex-1 bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                      <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="min-w-[120px] bg-primary hover:bg-primary/90 transition-all duration-200"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Generating
                          </span>
                        ) : (
                          'Generate'
                        )}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {appData && (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Your App</span>
                  </div>
                </div>
                
                <AppCard
                  title={appData?.title || ''}
                  icon={appData?.icon || ''}
                  primaryGenre={appData?.primaryGenre || ''}
                  keywords={appData?.keywords || []}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                />
              </div>
            )}

            {(similarApps.length > 0 || isSimilarAppsLoading) && (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {isSimilarAppsLoading ? 'Loading Similar Apps' : 'Similar Apps'}
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {isSimilarAppsLoading ? (
                    [1, 2, 3].map((index) => (
                      <AppCardSkeleton
                        key={`skeleton-${index}`}
                        className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                      />
                    ))
                  ) : (
                    similarApps.map((app, index) => (
                      <AppCard
                        key={app.title}
                        title={app.title}
                        icon={app.icon}
                        primaryGenre={app.primaryGenre}
                        keywords={app.keywords}
                        className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="relative py-8 text-center text-sm text-muted-foreground">
          <span>Made with ❤️ from Berlin</span>
        </footer>
      </div>
    </div>
  );
}
