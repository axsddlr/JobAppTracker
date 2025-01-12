'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { JobApplication } from '@/types/job-application';

interface PlatformPieChartProps {
  applications: JobApplication[];
}

export function PlatformPieChart({ applications }: PlatformPieChartProps) {
  const platformCounts = applications.reduce(
    (acc, app) => {
      const platform = app.platform || 'unspecified';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = [
    { name: 'Google Jobs', value: platformCounts.google_jobs || 0, color: 'rgb(66, 133, 244)' }, // Google Blue
    { name: 'LinkedIn', value: platformCounts.linkedin || 0, color: 'rgb(10, 102, 194)' }, // LinkedIn Blue
    { name: 'Indeed', value: platformCounts.indeed || 0, color: 'rgb(2, 120, 174)' }, // Indeed Blue
    { name: 'Glassdoor', value: platformCounts.glassdoor || 0, color: 'rgb(0, 182, 125)' }, // Glassdoor Green
    { name: 'Other', value: platformCounts.other || 0, color: 'rgb(156, 163, 175)' }, // Gray
    { name: 'Unspecified', value: platformCounts.unspecified || 0, color: 'rgb(209, 213, 219)' }, // Light Gray
  ].filter(item => item.value > 0);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">Platform Distribution</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}