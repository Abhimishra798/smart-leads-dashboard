import React from 'react';
import { Search, Download, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadFilters } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/utils/formatters';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onExport: () => void;
  onCreateNew: () => void;
}

export const LeadFiltersBar: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  onExport,
  onCreateNew,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-100">Leads Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" onClick={onExport} icon={Download} className="flex-1 sm:flex-none">
            Export CSV
          </Button>
          <Button variant="primary" onClick={onCreateNew} icon={Plus} className="flex-1 sm:flex-none">
            New Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 card bg-surface-800/50 border-white/5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <Input
            placeholder="Search name or email..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select
          options={[
            { value: '', label: 'All Statuses' },
            ...LEAD_STATUSES.map(s => ({ value: s, label: s }))
          ]}
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value as any })}
        />

        <Select
          options={[
            { value: '', label: 'All Sources' },
            ...LEAD_SOURCES.map(s => ({ value: s, label: s }))
          ]}
          value={filters.source}
          onChange={(e) => onFilterChange({ source: e.target.value as any })}
        />

        <Select
          options={[
            { value: 'latest', label: 'Latest First' },
            { value: 'oldest', label: 'Oldest First' },
          ]}
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value as any })}
        />
      </div>
    </div>
  );
};
