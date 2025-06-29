import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
              <Input type="text" placeholder="Enter your trackId" />
              <Button>Generate</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <span>With ❤️ from Berlin</span>
      </footer>
    </div >
  );
}
