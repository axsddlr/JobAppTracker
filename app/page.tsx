'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, Briefcase, Keyboard } from 'lucide-react';
import JobApplicationForm from '@/components/JobApplicationForm';
import JobApplicationList from '@/components/JobApplicationList';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { StatisticsPanel } from '@/components/statistics/StatisticsPanel';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterBar, FilterState } from '@/components/filters/FilterBar';
import { BulkActionBar } from '@/components/bulk-actions/BulkActionBar';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { filterApplications } from '@/lib/utils/filters';
import { JobApplication, ApplicationStatus } from '@/types/job-application';
import { useApplications } from '@/hooks/use-applications';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    dateRange: 'all',
  });

  const { 
    applications, 
    isLoading, 
    createApplication, 
    updateApplication, 
    deleteApplication 
  } = useApplications();

  useKeyboardShortcuts({
    'shift+n': () => setIsFormOpen(true),
    'shift+f': () => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(),
    'escape': () => setSelectedIds([]),
  });

  const handleSubmit = async (application: Partial<JobApplication>) => {
    try {
      if (editingApplication) {
        await updateApplication(editingApplication.id, application);
      } else {
        await createApplication(application);
      }
      setIsFormOpen(false);
      setEditingApplication(null);
    } catch (error) {
      console.error('Failed to handle application:', error);
    }
  };

  const handleBulkStatusChange = async (status: ApplicationStatus) => {
    try {
      for (const id of selectedIds) {
        await updateApplication(id, { status });
      }
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteApplication(id);
      }
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to delete applications:', error);
    }
  };

  const filteredApplications = filterApplications(applications, searchQuery, filters);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Job Application Tracker</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ThemeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                  <Keyboard className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">New Application</div>
                    <div className="text-sm font-mono">Shift + N</div>
                    <div className="text-sm">Search</div>
                    <div className="text-sm font-mono">Shift + F</div>
                    <div className="text-sm">Clear Selection</div>
                    <div className="text-sm font-mono">Esc</div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <SettingsDialog />
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        <StatisticsPanel applications={applications} />

        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <FilterBar onFilterChange={setFilters} />
          </div>
          
          <BulkActionBar
            selectedCount={selectedIds.length}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedIds([])}
          />
        </div>
        
        <JobApplicationList 
          applications={filteredApplications}
          isLoading={isLoading}
          onDelete={deleteApplication}
          onEdit={(app) => {
            setEditingApplication(app);
            setIsFormOpen(true);
          }}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        
        {isFormOpen && (
          <JobApplicationForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingApplication(null);
            }}
            initialData={editingApplication || undefined}
            mode={editingApplication ? 'edit' : 'create'}
          />
        )}
      </div>
    </main>
  );
}