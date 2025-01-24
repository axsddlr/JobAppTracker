'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ApplicationStatus } from '@/types/job-application';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export interface FilterState {
  status: ApplicationStatus | 'all';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export function FilterBar({ onFilterChange, itemsPerPage, onItemsPerPageChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    dateRange: 'all',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex items-center gap-4">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange}
        onValueChange={(value) => handleFilterChange('dateRange', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={itemsPerPage.toString()}
        onValueChange={(value) => onItemsPerPageChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="25">25 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
          <SelectItem value="100">100 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}