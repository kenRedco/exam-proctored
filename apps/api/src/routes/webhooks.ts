import { Express } from 'express';
import Stripe from 'stripe';
import { WebhookEvent } from '../models/WebhookEvent';
import * as PaymentsService from '../services/payments';
import * as BookingsService from '../services/bookings';
import * as NotificationService from '../services/notifications';

export function registerWebhookRoutes(app: Express) {
  // Stripe webhook
  app.post('/webhooks/stripe', expressRawBody, async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const stripe = PaymentsService.getStripe();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent((req as any).rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    await WebhookEvent.create({ provider: 'stripe', eventType: event.type, externalId: event.id, payload: event });

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const meta = (pi.metadata || {}) as any;
        if (meta.type === 'upfront') await BookingsService.markApproved(meta.bookingId);
        if (meta.type === 'remaining') await BookingsService.afterPaidInFull(meta.bookingId);
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await NotificationService.queueByBookingMeta((pi.metadata as any)?.bookingId, 'payment.failed', {});
        break;
      }
    }
    res.json({ received: true });
  });
}

// Helper to capture raw body for Stripe signature verification
function expressRawBody(req: any, res: any, next: any) {
  let data = Buffer.from('');
  req.on('data', (chunk: Buffer) => {
    data = Buffer.concat([data, chunk]);
  });
  req.on('end', () => {
    req.rawBody = data;
    next();
  });
}

