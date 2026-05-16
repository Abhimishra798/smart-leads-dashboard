import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';
import { Button } from './Button';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-slate-200">{((meta.page - 1) * meta.limit) + 1}</span> to{' '}
            <span className="font-medium text-slate-200">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            of <span className="font-medium text-slate-200">{meta.total}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={!meta.hasPrevPage}
              className="rounded-l-md rounded-r-none border border-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${page === meta.page
                    ? 'z-10 bg-brand-500/20 border-brand-500/50 text-brand-400'
                    : 'bg-surface-800 border-white/10 text-slate-400 hover:bg-surface-700'
                  }
                `}
              >
                {page}
              </button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={!meta.hasNextPage}
              className="rounded-r-md rounded-l-none border border-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
