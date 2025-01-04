'use client';

import { useState } from 'react';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { exportToExcel } from '@/lib/data/excel';
import { exportToJSON } from '@/lib/data/export';
import { importFromJSON } from '@/lib/data/import';
import { useToast } from '@/hooks/use-toast';

interface DataManagementProps {
  onSuccess?: () => void;
}

export function DataManagement({ onSuccess }: DataManagementProps) {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleExportExcel = async () => {
    try {
      await exportToExcel();
      toast({
        title: 'Success',
        description: 'Applications exported to Excel successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export applications to Excel',
        variant: 'destructive',
      });
    }
  };

  const handleExportJSON = async () => {
    try {
      const jsonData = await exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job-applications-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Applications exported to JSON successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export applications to JSON',
        variant: 'destructive',
      });
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      await importFromJSON(text);
      
      toast({
        title: 'Success',
        description: 'Applications imported successfully',
      });
      
      onSuccess?.();
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import applications',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Export Data</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </button>
          
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Backup (JSON)
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Import Data</h3>
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isImporting}
          />
          <button
            className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ${
              isImporting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-4 w-4" />
            Import Backup
          </button>
        </div>
      </div>
    </div>
  );
}