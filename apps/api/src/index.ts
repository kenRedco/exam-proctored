import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as IOServer } from 'socket.io';
import mongoose from 'mongoose';
import IORedis from 'ioredis';
import { z } from 'zod';

import { registerAuthRoutes } from './routes/auth';
import { registerExamRoutes } from './routes/exams';
import { registerBookingRoutes } from './routes/bookings';
import { registerPaymentRoutes } from './routes/payments';
import { registerWebhookRoutes } from './routes/webhooks';
import { registerAdminRoutes } from './routes/admin';
import { registerMeRoutes } from './routes/me';
import { attachChat } from './socket/chat';
import { requireEnv } from './utils/env';
import { startQueues } from './queue';
import { ExamType } from './models/ExamType';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const FRONTEND_URL = requireEnv('FRONTEND_URL');
const MONGODB_URI = requireEnv('MONGODB_URI');
const REDIS_URL = requireEnv('REDIS_URL');
const DISABLE_REDIS = process.env.DISABLE_REDIS === 'true';

async function main() {
  // Try primary MongoDB first; optionally fall back to local if provided
  const mongoOpts: any = { serverSelectionTimeoutMS: 5000 };
  try {
    await mongoose.connect(MONGODB_URI, mongoOpts);
  } catch (err) {
    const fb = process.env.MONGODB_URI_FALLBACK;
    if (fb) {
      console.warn('Primary MongoDB unreachable. Trying fallback MONGODB_URI_FALLBACK...');
      await mongoose.connect(fb, mongoOpts);
    } else {
      throw err;
    }
  }
  // Auto-seed exams if empty (dev convenience)
  try {
    const count = await ExamType.countDocuments({});
    if (count === 0) {
      const seed = [
        { slug: 'toefl', name: 'TOEFL', provider: 'ETS', durationMinutes: 120, basePrice: 20000, currency: 'USD', enabled: true },
        { slug: 'ielts', name: 'IELTS', provider: 'IDP/BC', durationMinutes: 170, basePrice: 20000, currency: 'USD', enabled: true },
        { slug: 'capm', name: 'CAPM', provider: 'PMI', durationMinutes: 180, basePrice: 25000, currency: 'USD', enabled: true },
        { slug: 'teas', name: 'TEAS', provider: 'ATI', durationMinutes: 180, basePrice: 18000, currency: 'USD', enabled: true },
        { slug: 'hesi', name: 'HESI', provider: 'Elsevier', durationMinutes: 180, basePrice: 18000, currency: 'USD', enabled: true },
      ];
      await ExamType.insertMany(seed);
      console.log(`Seeded ${seed.length} exam types`);
    }
  } catch (e) {
    console.warn('ExamType auto-seed skipped:', e);
  }

  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: [FRONTEND_URL], credentials: true }));
  // Stripe webhook requires raw body; mount webhooks before JSON parser
  registerWebhookRoutes(app);
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  // Health
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // Routes
  registerAuthRoutes(app);
  registerExamRoutes(app);
  registerBookingRoutes(app);
  registerPaymentRoutes(app);
  registerAdminRoutes(app);
  registerMeRoutes(app);

  const server = http.createServer(app);
  // Socket.IO
  const io = new IOServer(server, {
    cors: { origin: [FRONTEND_URL] }
  });
  attachChat(io);

  if (!DISABLE_REDIS) {
    // Probe Redis reachability and start queues only if reachable
    const probe = new IORedis(REDIS_URL, {
      lazyConnect: true,
      connectTimeout: 5000,
      retryStrategy: () => null,
      enableOfflineQueue: false,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });
    try {
      await probe.connect();
      await probe.ping();
      startQueues();
      console.log('Queues started (Redis connected)');
    } catch (e) {
      console.warn('Redis not reachable. Queues disabled for this run. Set DISABLE_REDIS=true to silence this notice.');
    } finally {
      try { probe.disconnect(); } catch {}
    }
  } else {
    console.log('DISABLE_REDIS=true — skipping Redis/queues');
  }

  server.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
