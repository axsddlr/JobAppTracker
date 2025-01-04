'use client';

import { ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { JobApplication } from '@/types/job-application';

interface JobApplicationListProps {
  applications: JobApplication[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit: (application: JobApplication) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export default function JobApplicationList({ 
  applications, 
  isLoading, 
  onDelete,
  onEdit,
  selectedIds,
  onSelectionChange
}: JobApplicationListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200';
      default:
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? applications.map(app => app.id) : []);
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    onSelectionChange(
      checked 
        ? [...selectedIds, id]
        : selectedIds.filter(selectedId => selectedId !== id)
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">No job applications found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted border-b">
              <th className="px-4 sm:px-6 py-3 text-left">
                <Checkbox
                  checked={applications.length > 0 && selectedIds.length === applications.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all applications"
                />
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Company</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Date Applied</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-muted/50">
                <td className="px-4 sm:px-6 py-4">
                  <Checkbox
                    checked={selectedIds.includes(app.id)}
                    onCheckedChange={(checked) => handleSelectOne(app.id, checked as boolean)}
                    aria-label={`Select ${app.companyName} application`}
                  />
                </td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground">{app.companyName}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground">
                  {new Date(app.dateApplied).toLocaleDateString()}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onEdit(app)}
                      className="text-primary hover:opacity-80 flex items-center gap-1"
                      aria-label="Edit application"
                    >
                      <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:opacity-80 flex items-center gap-1"
                    >
                      View <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                    <button
                      onClick={() => onDelete(app.id)}
                      className="text-destructive hover:opacity-80 flex items-center gap-1"
                      aria-label="Delete application"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}