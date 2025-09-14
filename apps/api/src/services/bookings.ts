import { Booking } from '../models/Booking';

export async function markApproved(bookingId: string) {
  await Booking.findByIdAndUpdate(bookingId, {
    status: 'approved',
    $push: { history: { action: 'approved' } }
  });
}

export async function afterPaidInFull(bookingId: string) {
  await Booking.findByIdAndUpdate(bookingId, {
    $push: { history: { action: 'paid_in_full' } }
  });
}

