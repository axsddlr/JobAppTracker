'use client';

import { ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { JobApplication, ApplicationStatus, Platform, APPLICATION_STATUSES, PLATFORMS } from '@/types/job-application';
import { formatSnakeCase, formatDate } from '@/lib/utils';
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

interface ApplicationTableRowProps {
  app: JobApplication;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
  onPlatformChange: (id: number, platform: Platform | undefined, customPlatform?: string) => void;
}

export function ApplicationTableRow({
  app,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
  onPlatformChange,
}: ApplicationTableRowProps) {
  const statusColor = getStatusColor(app.status);
  const displayPlatform = formatPlatformName(app.platform, app.customPlatform);

  return (
    <tr className="hover:bg-muted/50">
      <td className="px-4 sm:px-6 py-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(app.id, checked as boolean)}
          aria-label={`Select ${app.companyName} application`}
        />
      </td>
      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground">{app.companyName}</td>
      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground">{app.position || '-'}</td>
      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-2 py-1 text-xs font-medium rounded-md hover:bg-muted min-w-[100px] text-left">
              {displayPlatform}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => onPlatformChange(app.id, undefined)} className="whitespace-nowrap">
              None
            </DropdownMenuItem>
            {PLATFORMS.map(p => (
              <DropdownMenuItem key={p} onClick={() => onPlatformChange(app.id, p)} className="whitespace-nowrap">
                {formatSnakeCase(p)}
              </DropdownMenuItem>
            ))}
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
            <button className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${statusColor}`}>
              {formatSnakeCase(app.status)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {APPLICATION_STATUSES.map(s => (
              <DropdownMenuItem
                key={s}
                onClick={() => onStatusChange(app.id, s)}
                className={app.status === s ? getStatusColor(s) : ''}
              >
                {formatSnakeCase(s)}
              </DropdownMenuItem>
            ))}
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
  );
}

function formatPlatformName(platform: Platform | undefined, customPlatform: string | undefined) {
  if (platform === 'other') return customPlatform || 'Other';
  return platform ? formatSnakeCase(platform) : '-';
}

function getStatusColor(status: string) {
  switch (status) {
    case 'accepted': return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200';
    case 'rejected': return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200';
    case 'never_responded': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    case 'interview': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    default: return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200';
  }
}
