import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead, CreateLeadPayload, UpdateLeadPayload, LeadStatus, LeadSource } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/utils/formatters';
import { leadsApi } from '@/api/leadsApi';
import toast from 'react-hot-toast';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSuccess: () => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, lead, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'New' as LeadStatus,
    source: 'Website' as LeadSource,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      });
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (lead) {
        await leadsApi.update(lead._id, formData as UpdateLeadPayload);
        toast.success('Lead updated successfully');
      } else {
        await leadsApi.create(formData as CreateLeadPayload);
        toast.success('Lead created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-800 border border-white/10 rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-slate-100">
            {lead ? 'Edit Lead' : 'Create New Lead'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Select
            label="Status"
            required
            options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
          />

          <Select
            label="Source"
            required
            options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
          />

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {lead ? 'Save Changes' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
