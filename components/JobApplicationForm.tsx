'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '@/types/job-application';

interface JobApplicationFormProps {
  onSubmit: (application: Partial<JobApplication>) => void;
  onCancel: () => void;
  initialData?: JobApplication;
  mode?: 'create' | 'edit';
}

export default function JobApplicationForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  mode = 'create' 
}: JobApplicationFormProps) {
  // Get today's date in local timezone
  const today = new Date();
  const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

  const [formData, setFormData] = useState<Partial<JobApplication>>({
    companyName: initialData?.companyName || '',
    jobUrl: initialData?.jobUrl || '',
    dateApplied: initialData?.dateApplied || localDate,
    status: initialData?.status || 'pending' as ApplicationStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {mode === 'create' ? 'Add New Application' : 'Edit Application'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Company Name</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-md bg-background border text-foreground"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Job Posting URL</label>
            <input
              type="url"
              required
              className="w-full p-2 rounded-md bg-background border text-foreground"
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Date Applied</label>
            <input
              type="date"
              required
              max={localDate}
              className="w-full p-2 rounded-md bg-background border text-foreground"
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
            <select
              className="w-full p-2 rounded-md bg-background border text-foreground"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
            >
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              {mode === 'create' ? 'Add Application' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}