'use client';

import { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus, Platform } from '@/types/job-application';
import { fetchApplications, createApplication as create, updateApplication as update, remove } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const data = await fetchApplications();
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
    try {
      if (!application.companyName || !application.jobUrl || !application.dateApplied || !application.status) {
        throw new Error('Missing required fields');
      }

      const newApplication = {
        companyName: application.companyName,
        jobUrl: application.jobUrl,
        dateApplied: application.dateApplied,
        status: application.status,
        position: application.position || undefined,
        platform: application.platform,
        customPlatform: application.platform === 'other' ? application.customPlatform : undefined,
      };

      const created = await create(newApplication);
      setApplications(prev => [created, ...prev]);
      toast({
        title: 'Success',
        description: 'Application added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add application',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateApplication = async (id: number, updates: Partial<JobApplication>) => {
    try {
      const updatedData = {
        ...updates,
        position: updates.position || undefined,
        customPlatform: updates.platform === 'other' ? updates.customPlatform : undefined,
      };

      const updated = await update(id, updatedData);
      setApplications(prev => prev.map(app => app.id === id ? updated : app));
      toast({
        title: 'Success',
        description: 'Application updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update application',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateApplicationStatus = async (id: number, status: ApplicationStatus) => {
    try {
      const updated = await update(id, { status });
      setApplications(prev => prev.map(app => app.id === id ? updated : app));
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateApplicationPlatform = async (id: number, platform: Platform | undefined, customPlatform?: string) => {
    try {
      const updates = {
        platform,
        customPlatform: platform === 'other' ? customPlatform : undefined,
      };
      const updated = await update(id, updates);
      setApplications(prev => prev.map(app => app.id === id ? updated : app));
      toast({
        title: 'Success',
        description: 'Platform updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update platform',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteApplication = async (id: number) => {
    try {
      await remove(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const bulkUpdateStatus = async (ids: number[], status: ApplicationStatus) => {
    try {
      const updatedApps: JobApplication[] = [];
      for (const id of ids) {
        const updated = await update(id, { status });
        updatedApps.push(updated);
      }
      const updatedMap = new Map(updatedApps.map(app => [app.id, app]));
      setApplications(prev => prev.map(app => updatedMap.get(app.id) || app));
      toast({
        title: 'Success',
        description: `Updated ${ids.length} application${ids.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update statuses',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const bulkDelete = async (ids: number[]) => {
    try {
      for (const id of ids) {
        await remove(id);
      }
      const deleteSet = new Set(ids);
      setApplications(prev => prev.filter(app => !deleteSet.has(app.id)));
      toast({
        title: 'Success',
        description: `Deleted ${ids.length} application${ids.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete applications',
        variant: 'destructive',
      });
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
