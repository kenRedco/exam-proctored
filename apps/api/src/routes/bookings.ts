import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { authRequired } from '../middleware/auth';
import { ExamType } from '../models/ExamType';
import { Booking } from '../models/Booking';

const createSchema = z.object({
  examTypeId: z.string(),
  preferredStartAt: z.string(),
  timezone: z.string().optional(),
});

export function registerBookingRoutes(app: Express) {
  // POST /bookings – create
  app.post('/bookings', authRequired, async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const parse = createSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const { examTypeId, preferredStartAt, timezone } = parse.data;

    const exam = await ExamType.findById(examTypeId);
    if (!exam || !exam.enabled) return res.status(400).json({ error: 'Invalid exam' });

    const totalMinor = exam.basePrice;
    const upfrontMinor = Math.floor(totalMinor / 2);
    const remainingMinor = totalMinor - upfrontMinor;

    const booking = await Booking.create({
      userId,
      examTypeId,
      preferredStartAt: new Date(preferredStartAt),
      timezone,
      status: 'pending',
      pricing: { currency: exam.currency, totalMinor, upfrontMinor, remainingMinor, discountsMinor: 0 },
      history: [{ action: 'created', note: 'Booking requested' }],
    });

    res.json({ booking });
  });

  // GET /bookings/:id – fetch
  app.get('/bookings/:id', authRequired, async (req, res) => {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) return res.status(404).json({ error: 'Not found' });
    // Ensure user owns or is admin/proctor; simplified for starter
    if (booking.userId?.toString() !== req.auth!.userId && req.auth!.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ booking });
  });
}

