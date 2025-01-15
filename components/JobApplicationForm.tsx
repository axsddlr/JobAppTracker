'use client';

import { useState } from 'react';
import { JobApplication, Platform } from '@/types/job-application';

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
  const today = new Date();
  const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

  const [formData, setFormData] = useState<Partial<JobApplication>>({
    companyName: initialData?.companyName || '',
    position: initialData?.position || '',
    platform: initialData?.platform || undefined,
    customPlatform: initialData?.customPlatform || '',
    jobUrl: initialData?.jobUrl || '',
    dateApplied: initialData?.dateApplied || localDate,
    status: initialData?.status || 'pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure platform data is included in submission
    const submissionData = {
      ...formData,
      platform: formData.platform,
      customPlatform: formData.platform === 'other' ? formData.customPlatform : undefined,
    };
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {mode === 'create' ? 'Add New Application' : 'Edit Application'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
            <label className="block text-sm font-medium mb-1 text-foreground">Position</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-background border text-foreground"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Platform</label>
            <select
              className="w-full p-2 rounded-md bg-background border text-foreground mb-2"
              value={formData.platform || ''}
              onChange={(e) => {
                const platform = e.target.value as Platform | '';
                setFormData({ 
                  ...formData, 
                  platform: platform || undefined,
                  customPlatform: platform !== 'other' ? undefined : formData.customPlatform 
                });
              }}
            >
              <option value="">Select Platform (Optional)</option>
              <option value="google_jobs">Google Jobs</option>
              <option value="linkedin">LinkedIn</option>
              <option value="indeed">Indeed</option>
              <option value="glassdoor">Glassdoor</option>
              <option value="other">Other</option>
            </select>
            {formData.platform === 'other' && (
              <input
                type="text"
                className="w-full p-2 rounded-md bg-background border text-foreground"
                value={formData.customPlatform}
                onChange={(e) => setFormData({ ...formData, customPlatform: e.target.value })}
                placeholder="Enter platform name"
              />
            )}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as JobApplication['status'] })}
            >
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
              <option value="never_responded">Never Responded</option>
              <option value="interview">Interview</option>
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