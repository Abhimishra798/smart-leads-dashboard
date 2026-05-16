import axiosInstance from './axiosInstance';
import { ApiResponse, Lead, CreateLeadPayload, UpdateLeadPayload, LeadFilters } from '@/types';

type LeadsResponse = ApiResponse<Lead[]>;
type LeadResponse = ApiResponse<Lead>;

const buildParams = (filters: Partial<LeadFilters>): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.status)  params.set('status',  filters.status);
  if (filters.source)  params.set('source',  filters.source);
  if (filters.search)  params.set('search',  filters.search);
  if (filters.sort)    params.set('sort',    filters.sort);
  if (filters.page)    params.set('page',    String(filters.page));
  if (filters.limit)   params.set('limit',   String(filters.limit));
  return params;
};

export const leadsApi = {
  getStats: () =>
    axiosInstance.get('/leads/stats'),

  getAll: (filters: Partial<LeadFilters>) =>
    axiosInstance.get<LeadsResponse>(`/leads?${buildParams(filters)}`),

  getById: (id: string) =>
    axiosInstance.get<LeadResponse>(`/leads/${id}`),

  create: (data: CreateLeadPayload) =>
    axiosInstance.post<LeadResponse>('/leads', data),

  update: (id: string, data: UpdateLeadPayload) =>
    axiosInstance.put<LeadResponse>(`/leads/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(`/leads/${id}`),

  exportCsv: (filters: Partial<LeadFilters>) =>
    axiosInstance.get(`/leads/export/csv?${buildParams(filters)}`, {
      responseType: 'blob',
    }),
};
