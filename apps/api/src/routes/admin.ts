import { Express } from 'express';
import { requireRole } from '../middleware/auth';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { z } from 'zod';

export function registerAdminRoutes(app: Express) {
  app.get('/admin/bookings', requireRole('admin'), async (req, res) => {
    const status = req.query.status as string | undefined;
    const q: any = {};
    if (status) q.status = status;
    const items = await Booking.find(q).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ items });
  });

  app.get('/admin/payments', requireRole('admin'), async (_req, res) => {
    const items = await Payment.find({}).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ items });
  });

  // Simple seed endpoint (dev convenience)
  app.post('/admin/seed', requireRole('admin'), async (_req, res) => {
    const { ExamType } = await import('../models/ExamType');
    const seed = [
      { slug: 'toefl', name: 'TOEFL', basePrice: 20000, currency: 'USD', enabled: true },
      { slug: 'ielts', name: 'IELTS', basePrice: 20000, currency: 'USD', enabled: true },
      { slug: 'capm', name: 'CAPM', basePrice: 25000, currency: 'USD', enabled: true },
    ];
    for (const e of seed) {
      await ExamType.updateOne({ slug: e.slug }, { $setOnInsert: e }, { upsert: true });
    }
    res.json({ ok: true });
  });

  // PATCH /bookings/:id/assign – assign proctor and optional meeting info
  const assignSchema = z.object({
    proctorId: z.string(),
    meeting: z.object({ provider: z.enum(['zoom','gmeet','jitsi','other']).optional(), url: z.string().url().optional(), passcode: z.string().optional() }).optional()
  });
  app.patch('/bookings/:id/assign', requireRole('admin'), async (req, res) => {
    const parse = assignSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const { proctorId, meeting } = parse.data;
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      assignedProctorId: proctorId,
      ...(meeting ? { meeting } : {}),
      $push: { history: { action: 'assigned', note: `proctor:${proctorId}` } },
    }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json({ booking });
  });

  // PATCH /bookings/:id/status – update lifecycle status
  const statusSchema = z.object({ status: z.enum(['pending','approved','scheduled','in_progress','completed','cancelled','no_show','disputed']) });
  app.patch('/bookings/:id/status', requireRole('admin'), async (req, res) => {
    const parse = statusSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const { status } = parse.data;
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      status,
      $push: { history: { action: `status:${status}` } },
    }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json({ booking });
  });
}
