'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AppCardProps {
  title: string
  icon: string
  primaryGenre: string
  keywords: string[]
  className?: string
  style?: React.CSSProperties
}

export function AppCard({ title, icon, primaryGenre, keywords, className, style }: AppCardProps) {
  return (
    <Card 
      className={cn(
        'overflow-hidden backdrop-blur-sm bg-card/50 border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-card/60 hover:-translate-y-1',
        className
      )}
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <CardHeader className="relative flex flex-row items-start gap-4 pb-3">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          <Image
            src={icon}
            alt={`${title} icon`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <CardTitle className="line-clamp-2 text-xl font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm font-medium">{primaryGenre}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative pt-2">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 transition-all duration-200 hover:bg-primary/20 hover:ring-primary/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}