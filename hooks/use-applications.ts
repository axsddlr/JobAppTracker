'use client';

import { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus } from '@/types/job-application';
import { fetchApplications, createApplication as create, updateApplication as update, deleteApplication as remove } from '@/lib/db';
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
      // Validate required fields
      if (!application.companyName || !application.jobUrl || !application.dateApplied || !application.status) {
        throw new Error('Missing required fields');
      }

      // Include all fields in the creation
      const newApplication = {
        companyName: application.companyName,
        jobUrl: application.jobUrl,
        dateApplied: application.dateApplied,
        status: application.status,
        position: application.position || undefined, // Only include if not empty
        platform: application.platform,
        customPlatform: application.platform === 'other' ? application.customPlatform : undefined,
      };

      await create(newApplication);
      await loadApplications();
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
      // Ensure all fields are handled correctly in updates
      const updatedData = {
        ...updates,
        position: updates.position || undefined, // Only include if not empty
        customPlatform: updates.platform === 'other' ? updates.customPlatform : undefined,
      };

      await update(id, updatedData);
      await loadApplications();
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
      await update(id, { status });
      await loadApplications();
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

  const deleteApplication = async (id: number) => {
    try {
      await remove(id);
      await loadApplications();
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

  return {
    applications,
    isLoading,
    createApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
  };
}