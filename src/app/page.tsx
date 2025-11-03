
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/layout/Logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background px-4">
       <div className="absolute top-4 left-4">
         <Logo className="h-12 w-auto" />
       </div>
       <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Poldict</CardTitle>
          <CardDescription>The prediction market where you can create and vote on future events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard" passHref>
            <Button asChild className="w-full">
              <a>Enter</a>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
