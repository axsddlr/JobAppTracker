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
    { accepted: 0, rejected: 0, pending: 0, never_responded: 0, interview: 0 }
  );

  const data = [
    { name: 'Accepted', value: statusCounts.accepted, color: 'rgb(34, 197, 94)' }, // Green
    { name: 'Rejected', value: statusCounts.rejected, color: 'rgb(239, 68, 68)' }, // Red
    { name: 'Pending', value: statusCounts.pending, color: 'rgb(234, 179, 8)' },  // Yellow
    { name: 'Never Responded', value: statusCounts.never_responded, color: 'rgb(253, 224, 71)' }, // Light Yellow
    { name: 'Interview', value: statusCounts.interview, color: 'rgb(209, 213, 219)' }, // Light Gray
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