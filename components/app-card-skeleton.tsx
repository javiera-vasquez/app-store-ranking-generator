'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'

interface AppCardSkeletonProps {
  className?: string
}

export function AppCardSkeleton({ className }: AppCardSkeletonProps) {
  return (
    <Card 
      className={cn(
        'overflow-hidden backdrop-blur-sm bg-card/50 border-border/50 shadow-lg',
        className
      )}
    >
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <div className="h-20 w-20 rounded-2xl bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 rounded-full bg-muted animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}px` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}