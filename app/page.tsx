'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const mock = {"id":1294015297,"appId":"com.nicolaischneider.100questions","title":"100 Questions • Party Exposed","url":"https://apps.apple.com/us/app/100-questions-party-exposed/id1294015297?uo=4","description":"You are at a party and its getting more and more boring? It’s on you to change that! \n\nThat’s where 100 Questions comes into play! The 800+ built-in questions are the perfect ice-breaker for a group of people you just met or to just have a fun night with your friends.\nWho is the smartest? Who swipes always right on Tinder? Learn more about others and find out what they think about you!\nWhen a question appears on the screen you hand your phone to the person best suiting it. The person getting the phone will get a penalty and forward to the next question.\n\nDo you prefer the questions in the same order all the time or do you want to mix things up? Choose the game mode you like the most. \n\nEnjoy!","icon":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e5/55/93/e5559367-6fe9-c442-e8ce-0306814678aa/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.jpg","genres":["Entertainment","Games"],"genreIds":["6016","6014"],"primaryGenre":"Entertainment","primaryGenreId":6016,"contentRating":"17+","languages":["EN","DE"],"size":"23959552","requiredOsVersion":"15.0","released":"2017-12-08T02:58:48Z","updated":"2025-05-30T17:49:08Z","releaseNotes":"Minor improvements","version":"2.13.2","price":0,"currency":"USD","free":true,"developerId":1294015296,"developer":"Nicolai Schneider","developerUrl":"https://apps.apple.com/us/developer/nicolai-schneider/id1294015296?uo=4","developerWebsite":"https://www.100questions.club/","score":4.87179,"reviews":39,"currentVersionScore":4.87179,"currentVersionReviews":39,"screenshots":["https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/3a/b5/7e/3ab57e05-2781-1437-96a9-a1fb0fb1f5d8/2fd317cf-3d06-4bf2-8105-4d45d0a9681e_screen1-en-55.png/392x696bb.png","https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/c3/ad/0b/c3ad0b24-9f31-013d-8bcf-5fa3c74557b5/58463dfb-23d2-4ed4-8e10-2f1d03c36142_screen4-en-55.png/392x696bb.png","https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/5c/90/36/5c903662-2984-35bf-3b08-da5b7610867c/df3ba1a4-27d6-4d17-a775-d42c9c73cb04_screen3-en-55.png/392x696bb.png","https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/25/8d/c0/258dc0a9-55ea-2395-adf2-2f36567cbd14/882fc3c2-0f86-440f-8ea2-122e2fc07968_screen2-en-55.png/392x696bb.png","https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d9/83/b2/d983b2cf-98a3-2350-961a-2a16ae58de69/7b1413fa-ff62-4b2f-986d-e35828510aa9_screen4-en-55.png/392x696bb.png"],"ipadScreenshots":[],"appletvScreenshots":[],"supportedDevices":["iPhone5s-iPhone5s","iPadAir-iPadAir","iPadAirCellular-iPadAirCellular","iPadMiniRetina-iPadMiniRetina","iPadMiniRetinaCellular-iPadMiniRetinaCellular","iPhone6-iPhone6","iPhone6Plus-iPhone6Plus","iPadAir2-iPadAir2","iPadAir2Cellular-iPadAir2Cellular","iPadMini3-iPadMini3","iPadMini3Cellular-iPadMini3Cellular","iPodTouchSixthGen-iPodTouchSixthGen","iPhone6s-iPhone6s","iPhone6sPlus-iPhone6sPlus","iPadMini4-iPadMini4","iPadMini4Cellular-iPadMini4Cellular","iPadPro-iPadPro","iPadProCellular-iPadProCellular","iPadPro97-iPadPro97","iPadPro97Cellular-iPadPro97Cellular","iPhoneSE-iPhoneSE","iPhone7-iPhone7","iPhone7Plus-iPhone7Plus","iPad611-iPad611","iPad612-iPad612","iPad71-iPad71","iPad72-iPad72","iPad73-iPad73","iPad74-iPad74","iPhone8-iPhone8","iPhone8Plus-iPhone8Plus","iPhoneX-iPhoneX","iPad75-iPad75","iPad76-iPad76","iPhoneXS-iPhoneXS","iPhoneXSMax-iPhoneXSMax","iPhoneXR-iPhoneXR","iPad812-iPad812","iPad834-iPad834","iPad856-iPad856","iPad878-iPad878","iPadMini5-iPadMini5","iPadMini5Cellular-iPadMini5Cellular","iPadAir3-iPadAir3","iPadAir3Cellular-iPadAir3Cellular","iPodTouchSeventhGen-iPodTouchSeventhGen","iPhone11-iPhone11","iPhone11Pro-iPhone11Pro","iPadSeventhGen-iPadSeventhGen","iPadSeventhGenCellular-iPadSeventhGenCellular","iPhone11ProMax-iPhone11ProMax","iPhoneSESecondGen-iPhoneSESecondGen","iPadProSecondGen-iPadProSecondGen","iPadProSecondGenCellular-iPadProSecondGenCellular","iPadProFourthGen-iPadProFourthGen","iPadProFourthGenCellular-iPadProFourthGenCellular","iPhone12Mini-iPhone12Mini","iPhone12-iPhone12","iPhone12Pro-iPhone12Pro","iPhone12ProMax-iPhone12ProMax","iPadAir4-iPadAir4","iPadAir4Cellular-iPadAir4Cellular","iPadEighthGen-iPadEighthGen","iPadEighthGenCellular-iPadEighthGenCellular","iPadProThirdGen-iPadProThirdGen","iPadProThirdGenCellular-iPadProThirdGenCellular","iPadProFifthGen-iPadProFifthGen","iPadProFifthGenCellular-iPadProFifthGenCellular","iPhone13Pro-iPhone13Pro","iPhone13ProMax-iPhone13ProMax","iPhone13Mini-iPhone13Mini","iPhone13-iPhone13","iPadMiniSixthGen-iPadMiniSixthGen","iPadMiniSixthGenCellular-iPadMiniSixthGenCellular","iPadNinthGen-iPadNinthGen","iPadNinthGenCellular-iPadNinthGenCellular","iPhoneSEThirdGen-iPhoneSEThirdGen","iPadAirFifthGen-iPadAirFifthGen","iPadAirFifthGenCellular-iPadAirFifthGenCellular","iPhone14-iPhone14","iPhone14Plus-iPhone14Plus","iPhone14Pro-iPhone14Pro","iPhone14ProMax-iPhone14ProMax","iPadTenthGen-iPadTenthGen","iPadTenthGenCellular-iPadTenthGenCellular","iPadPro11FourthGen-iPadPro11FourthGen","iPadPro11FourthGenCellular-iPadPro11FourthGenCellular","iPadProSixthGen-iPadProSixthGen","iPadProSixthGenCellular-iPadProSixthGenCellular","iPhone15-iPhone15","iPhone15Plus-iPhone15Plus","iPhone15Pro-iPhone15Pro","iPhone15ProMax-iPhone15ProMax","iPadAir11M2-iPadAir11M2","iPadAir11M2Cellular-iPadAir11M2Cellular","iPadAir13M2-iPadAir13M2","iPadAir13M2Cellular-iPadAir13M2Cellular","iPadPro11M4-iPadPro11M4","iPadPro11M4Cellular-iPadPro11M4Cellular","iPadPro13M4-iPadPro13M4","iPadPro13M4Cellular-iPadPro13M4Cellular","iPhone16-iPhone16","iPhone16Plus-iPhone16Plus","iPhone16Pro-iPhone16Pro","iPhone16ProMax-iPhone16ProMax","iPadMiniA17Pro-iPadMiniA17Pro","iPadMiniA17ProCellular-iPadMiniA17ProCellular","iPhone16e-iPhone16e","iPadA16-iPadA16","iPadA16Cellular-iPadA16Cellular","iPadAir11M3-iPadAir11M3","iPadAir11M3Cellular-iPadAir11M3Cellular","iPadAir13M3-iPadAir13M3","iPadAir13M3Cellular-iPadAir13M3Cellular"]}

export default function Home() {

  const handleGenerate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/aso/keyword-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appData: mock
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        return;
      }
      
      console.log('Generated Keywords:', data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  }
  
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
              <Button onClick={handleGenerate}>Generate</Button>
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
