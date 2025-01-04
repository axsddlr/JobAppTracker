'use client';

import { useState, useEffect } from 'react';
import { JobApplication } from '@/types/job-application';
import { fetchApplications, createApplication as create, updateApplication as update, deleteApplication as remove } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

// Define required fields for creating a new application
type CreateApplicationInput = Pick<JobApplication, 'companyName' | 'jobUrl' | 'dateApplied' | 'status'>;

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

      const input: CreateApplicationInput = {
        companyName: application.companyName,
        jobUrl: application.jobUrl,
        dateApplied: application.dateApplied,
        status: application.status,
      };

      await create(input);
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
      await update(id, updates);
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
    deleteApplication,
  };
}