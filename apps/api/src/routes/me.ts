import { Express } from 'express';
import { authRequired } from '../middleware/auth';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Notification } from '../models/Notification';

export function registerMeRoutes(app: Express) {
  // GET /me/bookings
  app.get('/me/bookings', authRequired, async (req, res) => {
    const userId = req.auth!.userId;
    const items = await Booking.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ items });
  });

  // GET /me/payments
  app.get('/me/payments', authRequired, async (req, res) => {
    const userId = req.auth!.userId;
    const items = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ items });
  });

  // GET /me/notifications
  app.get('/me/notifications', authRequired, async (req, res) => {
    const userId = req.auth!.userId;
    const items = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ items });
  });
}

