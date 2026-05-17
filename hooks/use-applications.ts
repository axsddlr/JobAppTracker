'use client';

import { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus, Platform } from '@/types/job-application';
import { cleanOptionalField, customPlatformFor, generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const API_BASE = '/api/applications';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const data = await apiFetch(API_BASE);
      setApplications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const createApplication = async (application: Partial<JobApplication>) => {
    if (!application.companyName || !application.jobUrl || !application.dateApplied || !application.status) {
      throw new Error('Missing required fields');
    }

    const newApp = {
      id: generateId(),
      companyName: application.companyName,
      jobUrl: application.jobUrl,
      dateApplied: application.dateApplied,
      status: application.status,
      position: cleanOptionalField(application.position),
      platform: application.platform,
      customPlatform: customPlatformFor(application.platform, application.customPlatform),
      reason: application.reason || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const created = await apiFetch(API_BASE, { method: 'POST', body: JSON.stringify(newApp) });
      setApplications(prev => [created, ...prev]);
      toast({ title: 'Success', description: 'Application added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to add application', variant: 'destructive' });
      throw error;
    }
  };

  const updateApplication = async (id: number, updates: Partial<JobApplication>) => {
    try {
      const updated = await apiFetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updates,
          position: cleanOptionalField(updates.position),
          customPlatform: customPlatformFor(updates.platform as any, updates.customPlatform),
        }),
      });
      setApplications(prev => prev.map(app => app.id === id ? updated : app));
      toast({ title: 'Success', description: 'Application updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update application', variant: 'destructive' });
      throw error;
    }
  };

  const updateApplicationStatus = async (id: number, status: ApplicationStatus) => {
    return updateApplication(id, { status } as any);
  };

  const updateApplicationPlatform = async (id: number, platform: Platform | undefined, customPlatform?: string) => {
    return updateApplication(id, {
      platform,
      customPlatform: customPlatformFor(platform, customPlatform),
    } as any);
  };

  const deleteApplication = async (id: number) => {
    try {
      await apiFetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      setApplications(prev => prev.filter(app => app.id !== id));
      toast({ title: 'Success', description: 'Application deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete application', variant: 'destructive' });
      throw error;
    }
  };

  const bulkUpdateStatus = async (ids: number[], status: ApplicationStatus) => {
    try {
      await apiFetch(`${API_BASE}/batch`, {
        method: 'POST',
        body: JSON.stringify({ action: 'update-status', ids, status }),
      });
      setApplications(prev =>
        prev.map(app => ids.includes(app.id) ? { ...app, status, updated_at: new Date().toISOString() } : app)
      );
      toast({ title: 'Success', description: `Updated ${ids.length} application${ids.length > 1 ? 's' : ''}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update statuses', variant: 'destructive' });
      throw error;
    }
  };

  const bulkDelete = async (ids: number[]) => {
    try {
      await apiFetch(`${API_BASE}/batch`, {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', ids }),
      });
      const deleteSet = new Set(ids);
      setApplications(prev => prev.filter(app => !deleteSet.has(app.id)));
      toast({ title: 'Success', description: `Deleted ${ids.length} application${ids.length > 1 ? 's' : ''}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete applications', variant: 'destructive' });
      throw error;
    }
  };

  return {
    applications,
    isLoading,
    createApplication,
    updateApplication,
    updateApplicationStatus,
    updateApplicationPlatform,
    deleteApplication,
    bulkUpdateStatus,
    bulkDelete,
  };
}
