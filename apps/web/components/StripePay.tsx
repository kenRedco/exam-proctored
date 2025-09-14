"use client";
import { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = pk ? loadStripe(pk) : null;

export default function StripePay({ clientSecret, onSucceeded }: { clientSecret: string; onSucceeded?: () => void }) {
  if (!stripePromise) {
    return (
      <div className="text-sm text-rose-600">Stripe publishable key missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in apps/web/.env.</div>
    );
  }
  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <InnerPay clientSecret={clientSecret} onSucceeded={onSucceeded} />
    </Elements>
  );
}

function InnerPay({ clientSecret, onSucceeded }: { clientSecret: string; onSucceeded?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true); setError(null); setMsg(null);
    const card = elements.getElement(CardElement);
    if (!card) { setError('Card element not ready'); setSubmitting(false); return; }
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card }
    });
    if (result.error) {
      setError(result.error.message || 'Payment failed');
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      setMsg('Payment succeeded. You will receive a confirmation soon.');
      onSucceeded?.();
    } else {
      setMsg(`Status: ${result.paymentIntent?.status}`);
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handlePay} className="space-y-3">
      <div className="border rounded p-3 bg-white">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <div className="text-sm text-rose-600">{error}</div>}
      {msg && <div className="text-sm text-emerald-700">{msg}</div>}
      <button disabled={!stripe || submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Processing...' : 'Confirm payment'}</button>
    </form>
  );
}
