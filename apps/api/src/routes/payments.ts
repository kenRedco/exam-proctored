import { Express } from 'express';
import { authRequired } from '../middleware/auth';
import { createUpfrontIntent, chargeRemainingOffSession } from '../services/payments';

export function registerPaymentRoutes(app: Express) {
  // POST /payments/:bookingId/upfront
  app.post('/payments/:bookingId/upfront', authRequired, async (req, res) => {
    try {
      const clientSecret = await createUpfrontIntent(req.params.bookingId, req.auth!.userId);
      res.json({ clientSecret });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // POST /payments/:bookingId/remaining
  app.post('/payments/:bookingId/remaining', authRequired, async (req, res) => {
    try {
      const status = await chargeRemainingOffSession(req.params.bookingId);
      res.json({ status });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });
}

