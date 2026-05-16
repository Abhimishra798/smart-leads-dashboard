import { useState, useCallback, useEffect } from 'react';
import { leadsApi } from '@/api/leadsApi';
import { Lead, LeadFilters, PaginationMeta } from '@/types';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export const useLeads = (initialFilters: LeadFilters) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadsApi.getAll({
        ...filters,
        search: debouncedSearch,
      });
      if (response.data.success) {
        setLeads(response.data.data || []);
        if (response.data.pagination) {
          setMeta(response.data.pagination);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.source, filters.sort, filters.page, filters.limit, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => {
      // If changing anything other than page, reset page to 1
      const resetPage = ('status' in newFilters || 'source' in newFilters || 'search' in newFilters || 'sort' in newFilters);
      return {
        ...prev,
        ...newFilters,
        page: resetPage ? 1 : (newFilters.page || prev.page),
      };
    });
  };

  const deleteLead = async (id: string) => {
    try {
      const response = await leadsApi.delete(id);
      if (response.data.success) {
        toast.success('Lead deleted successfully');
        fetchLeads();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
      return false;
    }
  };

  const exportCsv = async () => {
    try {
      const response = await leadsApi.exportCsv({
        ...filters,
        search: debouncedSearch,
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  return {
    leads,
    meta,
    isLoading,
    filters,
    updateFilters,
    fetchLeads,
    deleteLead,
    exportCsv,
  };
};
