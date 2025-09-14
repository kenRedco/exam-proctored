import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

let connection: IORedis | null = null;
let queuesStarted = false;
let _notificationQueue: Queue | null = null;
let _reminderQueue: Queue | null = null;

function redisOptions(url: string) {
  const tls = url.startsWith('rediss://') ? {} : undefined;
  return { maxRetriesPerRequest: null as any, enableReadyCheck: false, tls };
}

export function getConnection(): IORedis {
  if (!connection) {
    const url = process.env.REDIS_URL!;
    connection = new IORedis(url, redisOptions(url));
  }
  return connection;
}

export function startQueues() {
  if (queuesStarted) return;
  const conn = getConnection();
  _notificationQueue = new Queue('notifications', { connection: conn });
  _reminderQueue = new Queue('reminders', { connection: conn });
  new Worker('notifications', async (job) => {
    console.log('Send notification', job.data);
  }, { connection: conn });
  new Worker('reminders', async (job) => {
    console.log('Run reminder', job.data);
  }, { connection: conn });
  queuesStarted = true;
}

export async function enqueueNotification(data: any) {
  if (!_notificationQueue) startQueues();
  await _notificationQueue!.add('send', data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
}

export async function enqueueReminder(data: any, runAt: Date) {
  if (!_reminderQueue) startQueues();
  await _reminderQueue!.add('remind', data, { delay: Math.max(0, runAt.getTime() - Date.now()) });
}
