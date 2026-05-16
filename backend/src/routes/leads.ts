import { Router } from 'express';
import {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// GET /api/leads/export/csv — must be BEFORE /:id to avoid conflict
router.get('/export/csv', exportLeadsCsv);

// GET    /api/leads
router.get('/', getLeads);

// GET    /api/leads/stats — must be BEFORE /:id
router.get('/stats', getLeadStats);

// POST   /api/leads
router.post('/', createLead);

// GET    /api/leads/:id
router.get('/:id', getLeadById);

// PUT    /api/leads/:id
router.put('/:id', updateLead);

// DELETE /api/leads/:id — Admin only
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
