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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface JobApplicationListProps {
  applications: JobApplication[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit: (application: JobApplication) => void;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
  onPlatformChange: (id: number, platform: Platform | undefined, customPlatform?: string) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function JobApplicationList({ 
  applications, 
  isLoading, 
  onDelete,
  onEdit,
  onStatusChange,
  onPlatformChange,
  selectedIds,
  onSelectionChange,
  currentPage,
  onPageChange,
  itemsPerPage
}: JobApplicationListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200';
      case 'never_responded':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
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

  // Calculate pagination
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
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
              {currentApplications.map((app) => (
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
                        <button className="px-2 py-1 text-xs font-medium rounded-md hover:bg-muted min-w-[100px] text-left">
                          {formatPlatformName(app.platform, app.customPlatform)}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuItem onClick={() => onPlatformChange(app.id, undefined)} className="whitespace-nowrap">
                          None
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPlatformChange(app.id, 'google_jobs')} className="whitespace-nowrap">
                          Google Jobs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPlatformChange(app.id, 'linkedin')} className="whitespace-nowrap">
                          LinkedIn
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPlatformChange(app.id, 'indeed')} className="whitespace-nowrap">
                          Indeed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPlatformChange(app.id, 'glassdoor')} className="whitespace-nowrap">
                          Glassdoor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPlatformChange(app.id, 'other')} className="whitespace-nowrap">
                          Other
                        </DropdownMenuItem>
                        {app.platform === 'other' && (
                          <div className="px-2 py-2">
                            <Input
                              type="text"
                              placeholder="Enter platform name"
                              value={app.customPlatform || ''}
                              onChange={(e) => onPlatformChange(app.id, 'other', e.target.value)}
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
                          onClick={() => onStatusChange(app.id, 'pending')}
                          className={app.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-950' : ''}
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onStatusChange(app.id, 'accepted')}
                          className={app.status === 'accepted' ? 'bg-green-100 dark:bg-green-950' : ''}
                        >
                          Accepted
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onStatusChange(app.id, 'rejected')}
                          className={app.status === 'rejected' ? 'bg-red-100 dark:bg-red-950' : ''}
                        >
                          Rejected
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onStatusChange(app.id, 'never_responded')}
                          className={app.status === 'never_responded' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                        >
                          Never Responded
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onStatusChange(app.id, 'interview')}
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}