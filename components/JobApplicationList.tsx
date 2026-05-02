import { Checkbox } from '@/components/ui/checkbox';
import { JobApplication, ApplicationStatus, Platform } from '@/types/job-application';
import { ApplicationTableRow } from '@/components/ApplicationTableRow';
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

export function JobApplicationList({
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

  const safeItemsPerPage = Math.max(itemsPerPage, 1);
  const totalPages = Math.ceil(applications.length / safeItemsPerPage);
  const startIndex = (currentPage - 1) * safeItemsPerPage;
  const endIndex = startIndex + safeItemsPerPage;
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
                <ApplicationTableRow
                  key={app.id}
                  app={app}
                  isSelected={selectedIds.includes(app.id)}
                  onSelect={handleSelectOne}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onPlatformChange={onPlatformChange}
                />
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
                {currentPage === 1 ? (
                  <span className="pointer-events-none opacity-50">
                    <PaginationPrevious />
                  </span>
                ) : (
                  <PaginationPrevious
                    onClick={() => onPageChange(currentPage - 1)}
                  />
                )}
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
                {currentPage === totalPages ? (
                  <span className="pointer-events-none opacity-50">
                    <PaginationNext />
                  </span>
                ) : (
                  <PaginationNext
                    onClick={() => onPageChange(currentPage + 1)}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
