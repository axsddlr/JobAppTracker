'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { JobApplication } from '@/types/job-application';

interface StatusPieChartProps {
  applications: JobApplication[];
}

export function StatusPieChart({ applications }: StatusPieChartProps) {
  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status]++;
      return acc;
    },
    { accepted: 0, rejected: 0, pending: 0 }
  );

  const data = [
    { name: 'Accepted', value: statusCounts.accepted, color: 'hsl(var(--chart-1))' },
    { name: 'Rejected', value: statusCounts.rejected, color: 'hsl(var(--chart-2))' },
    { name: 'Pending', value: statusCounts.pending, color: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">Application Status Distribution</h3>
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