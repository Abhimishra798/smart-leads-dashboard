import { LeadStatus, LeadSource } from '@/types';

export const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
};

export const formatDateTime = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  New: 'New',
  Contacted: 'Contacted',
  Qualified: 'Qualified',
  Lost: 'Lost',
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  Website: 'Website',
  Instagram: 'Instagram',
  Referral: 'Referral',
};

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];
