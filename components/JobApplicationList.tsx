import { ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { JobApplication, ApplicationStatus, Platform } from '@/types/job-application';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

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
      case 'never_responded':
        return 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-200';
      case 'interview':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
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

  const handleStatusChange = (app: JobApplication, newStatus: ApplicationStatus) => {
    onEdit({ ...app, status: newStatus });
  };

  const handlePlatformChange = (app: JobApplication, newPlatform: Platform | undefined) => {
    const updatedApp = { 
      ...app, 
      platform: newPlatform,
      customPlatform: newPlatform === 'other' ? app.customPlatform : undefined 
    };
    onEdit(updatedApp);
  };

  const handleCustomPlatformChange = (app: JobApplication, customPlatform: string) => {
    const updatedApp = { 
      ...app, 
      platform: 'other', 
      customPlatform 
    };
    onEdit(updatedApp);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatPlatformName = (platform: Platform | undefined, customPlatform: string | undefined) => {
    if (platform === 'other') {
      return customPlatform || 'Other';
    }
    return platform 
      ? platform.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
      : '-';
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
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Position</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Platform</th>
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
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground">{app.position || '-'}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-2 py-1 text-xs font-medium rounded-md hover:bg-muted">
                        {formatPlatformName(app.platform, app.customPlatform)}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      <DropdownMenuItem onClick={() => handlePlatformChange(app, undefined)}>
                        None
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePlatformChange(app, 'google_jobs')}>
                        Google Jobs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePlatformChange(app, 'linkedin')}>
                        LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePlatformChange(app, 'indeed')}>
                        Indeed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePlatformChange(app, 'glassdoor')}>
                        Glassdoor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePlatformChange(app, 'other')}>
                        Other
                      </DropdownMenuItem>
                      {app.platform === 'other' && (
                        <div className="px-2 py-2">
                          <Input
                            type="text"
                            placeholder="Enter platform name"
                            value={app.customPlatform || ''}
                            onChange={(e) => handleCustomPlatformChange(app, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground">
                  {formatDate(app.dateApplied)}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${getStatusColor(app.status)}`}
                      >
                        {app.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app, 'pending')}
                        className={app.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-950' : ''}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app, 'accepted')}
                        className={app.status === 'accepted' ? 'bg-green-100 dark:bg-green-950' : ''}
                      >
                        Accepted
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app, 'rejected')}
                        className={app.status === 'rejected' ? 'bg-red-100 dark:bg-red-950' : ''}
                      >
                        Rejected
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app, 'never_responded')}
                        className={app.status === 'never_responded' ? 'bg-yellow-50 dark:bg-yellow-950/50' : ''}
                      >
                        Never Responded
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(app, 'interview')}
                        className={app.status === 'interview' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                      >
                        Interview
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:opacity-80 flex items-center gap-1"
                          >
                            View <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs truncate">{app.jobUrl}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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