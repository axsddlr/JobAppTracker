'use client';

import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationStatus } from '@/types/job-application';

interface BulkActionBarProps {
  selectedCount: number;
  onBulkStatusChange: (status: ApplicationStatus) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  onBulkStatusChange,
  onBulkDelete,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
      <span className="text-sm text-muted-foreground">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex-1" />
      <Button
        variant="outline"
        size="sm"
        onClick={() => onBulkStatusChange('accepted')}
        className="text-green-600 hover:text-green-700"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Mark Accepted
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onBulkStatusChange('rejected')}
        className="text-red-600 hover:text-red-700"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Mark Rejected
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onBulkDelete}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
      >
        Clear Selection
      </Button>
    </div>
  );
}