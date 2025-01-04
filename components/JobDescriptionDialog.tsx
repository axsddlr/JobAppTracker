'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scrapeJobDescription } from '@/lib/scraper';
import { Alert } from '@/components/ui/alert';

interface JobDescriptionDialogProps {
  jobUrl: string;
  companyName: string;
}

export function JobDescriptionDialog({ jobUrl, companyName }: JobDescriptionDialogProps) {
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchDescription = async () => {
    if (description) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const text = await scrapeJobDescription(jobUrl);
      setDescription(text);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load job description');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) fetchDescription();
    }}>
      <DialogTrigger asChild>
        <button
          className="text-primary hover:opacity-80 flex items-center gap-1"
          aria-label="View job description"
        >
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{companyName} - Job Description</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] rounded-md border p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}
          {description && (
            <div className="whitespace-pre-wrap text-sm">
              {description}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}