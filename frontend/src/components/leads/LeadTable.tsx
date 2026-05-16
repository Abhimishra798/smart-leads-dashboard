import React from 'react';
import { Lead } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onEdit, onDelete }) => {
  const { user } = useAuth();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'primary';
      case 'Contacted': return 'warning';
      case 'Qualified': return 'success';
      case 'Lost': return 'danger';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-800 border-b border-surface-700/50" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg font-medium text-slate-300">No leads found</p>
        <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-800/50 border-b border-white/10 text-sm font-medium text-slate-400">
            <th className="p-4 rounded-tl-xl">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Status</th>
            <th className="p-4">Source</th>
            <th className="p-4">Created Date</th>
            <th className="p-4 rounded-tr-xl text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-white/5">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-surface-800/30 transition-colors group">
              <td className="p-4 font-medium text-slate-200">{lead.name}</td>
              <td className="p-4 text-slate-400">{lead.email}</td>
              <td className="p-4">
                <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
              </td>
              <td className="p-4 text-slate-400">{lead.source}</td>
              <td className="p-4 text-slate-400">{formatDate(lead.createdAt)}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(lead)} className="opacity-0 group-hover:opacity-100 px-2">
                  <Edit2 className="w-4 h-4" />
                </Button>
                {user?.role === 'admin' && (
                  <Button variant="danger" size="sm" onClick={() => onDelete(lead._id)} className="opacity-0 group-hover:opacity-100 px-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
