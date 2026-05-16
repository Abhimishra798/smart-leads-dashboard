import React, { useState } from 'react';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { Pagination } from '@/components/ui/Pagination';
import { useLeads } from '@/hooks/useLeads';
import { Lead } from '@/types';

export const Leads: React.FC = () => {
  const {
    leads,
    meta,
    isLoading,
    filters,
    updateFilters,
    fetchLeads,
    deleteLead,
    exportCsv,
  } = useLeads({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
    limit: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleCreateNew = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      await deleteLead(id);
    }
  };

  return (
    <div className="space-y-6">
      <LeadFiltersBar
        filters={filters}
        onFilterChange={updateFilters}
        onExport={exportCsv}
        onCreateNew={handleCreateNew}
      />

      <div className="card p-0 overflow-hidden bg-surface-800/30">
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {meta && !isLoading && leads.length > 0 && (
          <Pagination
            meta={meta}
            onPageChange={(page) => updateFilters({ page })}
          />
        )}
      </div>

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={selectedLead}
        onSuccess={fetchLeads}
      />
    </div>
  );
};
