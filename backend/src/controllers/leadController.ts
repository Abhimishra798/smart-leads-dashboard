import { Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose, { FilterQuery } from 'mongoose';
import { Lead } from '../models/Lead';
import { sendSuccess, sendError } from '../utils/response';
import { generateCsv } from '../utils/csvExport';
import { AuthRequest, ILead, LeadStatus, LeadSource } from '../types';

// ─── Validation Schemas ───────────────────────────────────────────────────────
const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

const updateLeadSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
});

// ─── Helper: Build filter query + apply RBAC ──────────────────────────────────
const buildQuery = (
  req: AuthRequest,
  extraFilters: FilterQuery<ILead> = {}
): FilterQuery<ILead> => {
  const { status, source, search } = req.query as {
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
  };

  const query: FilterQuery<ILead> = { ...extraFilters };

  // Sales users can only see their own leads
  if (req.user?.role === 'sales') {
    query.createdBy = req.user.userId;
  }

  if (status) query.status = status;
  if (source) query.source = source;

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  return query;
};

// ─── GET /api/leads ───────────────────────────────────────────────────────────
export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'oldest' ? { createdAt: 1 as const } : { createdAt: -1 as const };

    const query = buildQuery(req);
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, leads, 'Leads fetched successfully', 200, {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/stats ───────────────────────────────────────────────────────
export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const matchStage: any = {};
    
    // Sales users only see stats for their own leads
    if (req.user?.role === 'sales') {
      matchStage.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }

    const stats = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] } },
        },
      },
    ]);

    const result = stats.length > 0 ? stats[0] : { total: 0, new: 0, qualified: 0 };
    
    const conversionRate = result.total > 0 
      ? ((result.qualified / result.total) * 100).toFixed(1) 
      : '0';

    sendSuccess(res, {
      total: result.total,
      new: result.new,
      qualified: result.qualified,
      conversionRate
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .lean();

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales: can only view own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      sendError(res, 'Access denied. You can only view your own leads.', 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/leads ──────────────────────────────────────────────────────────
export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = createLeadSchema.parse(req.body);

    const lead = await Lead.create({
      ...data,
      createdBy: req.user?.userId,
    });

    const populated = await lead.populate('createdBy', 'name email role');
    sendSuccess(res, populated, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────
export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = updateLeadSchema.parse(req.body);

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales: can only update own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      sendError(res, 'Access denied. You can only update your own leads.', 403);
      return;
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role');

    sendSuccess(res, updated, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/leads/:id (Admin only) ───────────────────────────────────────
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/export/csv ────────────────────────────────────────────────
export const exportLeadsCsv = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = buildQuery(req);
    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

    const csv = generateCsv(leads as unknown as ILead[]);
    const filename = `leads-export-${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
