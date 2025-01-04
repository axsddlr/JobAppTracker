'use client';

import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatCard({ title, value, className }: StatCardProps) {
  return (
    <Card className={`p-4 flex flex-col space-y-1 ${className}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}