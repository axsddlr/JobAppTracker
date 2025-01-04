'use client';

import { JobApplication } from '@/types/job-application';
import { FilterState } from '@/components/filters/FilterBar';

export function filterApplications(
  applications: JobApplication[],
  searchQuery: string,
  filters: FilterState
): JobApplication[] {
  return applications.filter(app => {
    // Search filter
    const matchesSearch = !searchQuery || 
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filters.status === 'all' || app.status === filters.status;

    // Date filter
    const appDate = new Date(app.dateApplied);
    const today = new Date();
    let matchesDate = true;

    if (filters.dateRange === 'today') {
      matchesDate = appDate.toDateString() === today.toDateString();
    } else if (filters.dateRange === 'week') {
      const weekAgo = new Date(today.setDate(today.getDate() - 7));
      matchesDate = appDate >= weekAgo;
    } else if (filters.dateRange === 'month') {
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
      matchesDate = appDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });
}