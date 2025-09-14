import Stripe from 'stripe';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET) throw new Error('Missing STRIPE_SECRET');
  return new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2024-06-20' as any });
}

export async function createUpfrontIntent(bookingId: string, userId: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  const stripe = getStripe();
  const pi = await stripe.paymentIntents.create({
    amount: booking.pricing.upfrontMinor,
    currency: booking.pricing.currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    setup_future_usage: 'off_session',
    metadata: { bookingId: booking.id, type: 'upfront' }
  });
  await Payment.create({
    bookingId: booking.id,
    userId,
    currency: booking.pricing.currency,
    amountMinor: booking.pricing.upfrontMinor,
    type: 'upfront',
    provider: 'stripe',
    externalIds: { paymentIntentId: pi.id },
    status: 'processing'
  });
  return pi.client_secret;
}

export async function chargeRemainingOffSession(bookingId: string, userStripeId?: string) {
  const booking = await Booking.findById(bookingId).populate('userId');
  if (!booking) throw new Error('Booking not found');
  const stripe = getStripe();
  const pi = await stripe.paymentIntents.create({
    amount: booking.pricing.remainingMinor,
    currency: booking.pricing.currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    off_session: true,
    confirm: true,
    metadata: { bookingId: booking.id, type: 'remaining' }
  });
  await Payment.create({
    bookingId: booking.id,
    userId: (booking.userId as any)?.id,
    currency: booking.pricing.currency,
    amountMinor: booking.pricing.remainingMinor,
    type: 'remaining',
    provider: 'stripe',
    externalIds: { paymentIntentId: pi.id },
    status: pi.status === 'succeeded' ? 'succeeded' : 'processing'
  });
  return pi.status;
}

