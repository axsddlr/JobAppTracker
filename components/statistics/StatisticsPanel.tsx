'use client';

import { StatCard } from './StatCard';
import { StatusPieChart } from './StatusPieChart';
import { PlatformPieChart } from './PlatformPieChart';
import { JobApplication } from '@/types/job-application';

interface StatisticsPanelProps {
  applications: JobApplication[];
}

export function StatisticsPanel({ applications }: StatisticsPanelProps) {
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
  const successRate = totalApplications > 0 
    ? ((acceptedApplications / totalApplications) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Application Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Applications" 
          value={totalApplications} 
        />
        <StatCard 
          title="Success Rate" 
          value={`${successRate}%`}
        />
        <StatCard 
          title="Accepted" 
          value={acceptedApplications}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusPieChart applications={applications} />
        <PlatformPieChart applications={applications} />
      </div>
    </div>
  );
}