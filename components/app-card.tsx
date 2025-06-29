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
}

export function AppCard({ title, icon, primaryGenre, keywords, className }: AppCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-xl">
          <Image
            src={icon}
            alt={`${title} icon`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <CardDescription>{primaryGenre}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium leading-none">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
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