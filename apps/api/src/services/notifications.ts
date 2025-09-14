import { Notification } from '../models/Notification';
import { enqueueNotification } from '../queue/index';

export async function queue(userId: string, templateKey: string, payload: any, bookingId?: string) {
  const doc = await Notification.create({ userId, templateKey, payload, bookingId, status: 'queued' });
  await enqueueNotification({ notificationId: doc.id, userId, templateKey, payload, bookingId });
}

export async function queueByBookingMeta(bookingId: string, templateKey: string, payload: any) {
  const doc = await Notification.create({ bookingId, templateKey, payload, status: 'queued' });
  await enqueueNotification({ notificationId: doc.id, bookingId, templateKey, payload });
}
