'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppCard } from '@/components/app-card';

type AppData = {
  title: string;
  icon: string;
  primaryGenre: string;
  keywords: string[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
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
      // Get main app data
      const getAppData = await fetch(`http://localhost:3000/api/app-store-scraper/app/${trackIdNumber}`);
      const appData = await getAppData.json();

      if (appData) {

        // Get similar apps
        const getSimilarApps = await fetch(`http://localhost:3000/api/app-store-scraper/similar/${trackIdNumber}`);
        const similarApps = await getSimilarApps.json();

        console.log('Similar Apps:', similarApps);

        // Get top 3 similar apps data
        const top3SimilarApps = similarApps.slice(0, 3);
        const similarAppsData = await Promise.all(
          top3SimilarApps.map(async (app: any) => {
            const response = await fetch(`http://localhost:3000/api/app-store-scraper/app/${app.id}`);
            return response.json();
          })
        );

        // Generate keywords for all apps (main app + top 3 similar)
        const allApps = [appData, ...similarAppsData];
        const keywordResults = await Promise.all(
          allApps.map(async (app) => {
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
            return { app: app.title, keywords: data };
          })
        );

        const [mainApp, ...similarAppsKeywords] = keywordResults;
        setAppData({...appData, keywords: mainApp?.keywords.keywords || []});
        setSimilarApps(
          similarAppsData.map((app, idx) => (
            {...app, keywords: similarAppsKeywords[idx]?.keywords.keywords || []}
          ))
        );

        const validResults = keywordResults.filter(result => result !== null);
        console.log('Generated Keywords for all apps:', validResults);

        // Get ASO scores for first 3 keywords of main app
        if (validResults.length > 0 && validResults[0].keywords && validResults[0].keywords.keywords) {
          const mainAppKeywords = validResults[0].keywords.keywords.slice(0, 3);
          console.log('Analyzing first 3 keywords of main app:', mainAppKeywords);
          
          const keywordScoresResponse = await fetch('http://localhost:3000/api/aso/keyword-scores/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              keywords: mainAppKeywords
            })
          });

          if (keywordScoresResponse.ok) {
            const keywordScores = await keywordScoresResponse.json();
            
            // Combine keywords with their scores for better comprehension
            const keywordsWithScores = mainAppKeywords.map((keyword, index) => ({
              keyword: keyword,
              traffic_score: keywordScores[index]?.traffic_score || 0,
              difficulty_score: keywordScores[index]?.difficulty_score || 0
            }));
            
            console.log('ASO Keywords with Scores:', keywordsWithScores);
          } else {
            console.error('Failed to get keyword scores:', await keywordScoresResponse.json());
          }
        }
      }
    } catch (error) {
      setError('Request failed, please try again');
      console.error('Request failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Card className="min-w-[420px]">
          <CardHeader>
            <CardTitle>
              <h1>App Store Ranking Generator</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <label htmlFor="trackId">Add your trackId</label>
              <Input type="number" placeholder="Enter your trackId" value={trackId} onChange={(e) => setTrackId(e.target.value)} />
              <Button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate'}</Button>
            </div>
          </CardContent>
        </Card>

        {appData && (
        <AppCard
          title={appData?.title || ''}
          icon={appData?.icon || ''}
              primaryGenre={appData?.primaryGenre || ''}
            keywords={appData?.keywords || []}
          />
        )}

        {similarApps.map((app) => (
          <AppCard
            title={app.title}
            icon={app.icon}
            primaryGenre={app.primaryGenre}
            keywords={app.keywords}
          />
        ))}
        {error && <p className="text-red-500">{error}</p>}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <span>With ❤️ from Berlin</span>
      </footer>
    </div >
  );
}
