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
      if (app.platform) {
        acc[app.platform] = (acc[app.platform] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Define colors directly in the data array to ensure they're applied
  const data = [
    { 
      name: 'Google Jobs', 
      value: platformCounts.google_jobs || 0, 
      fill: '#22c55e'  // Green
    },
    { 
      name: 'LinkedIn', 
      value: platformCounts.linkedin || 0, 
      fill: '#0a66c2'  // LinkedIn blue
    },
    { 
      name: 'Indeed', 
      value: platformCounts.indeed || 0, 
      fill: '#2557a7'  // Indeed blue
    },
    { 
      name: 'Glassdoor', 
      value: platformCounts.glassdoor || 0, 
      fill: '#00b67d'  // Glassdoor green
    },
    { 
      name: 'Other', 
      value: platformCounts.other || 0, 
      fill: '#db2777'  // Dark pink
    }
  ].filter(item => item.value > 0);

  // If no platforms are specified, show empty state
  if (data.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Platform Distribution</h3>
        <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
          No platform data available
        </div>
      </Card>
    );
  }

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
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                />
              ))}
            </Pie>
            <Legend 
              formatter={(value) => <span style={{ color: data.find(item => item.name === value)?.fill }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}