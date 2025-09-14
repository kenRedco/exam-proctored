import { Express } from 'express';
import { ExamType } from '../models/ExamType';

export function registerExamRoutes(app: Express) {
  // Public list of enabled exams
  app.get('/exams', async (_req, res) => {
    const items = await ExamType.find({ enabled: true }).lean();
    res.json({ items });
  });

  // Public exam by slug
  app.get('/exams/:slug', async (req, res) => {
    const exam = await ExamType.findOne({ slug: req.params.slug, enabled: true }).lean();
    if (!exam) return res.status(404).json({ error: 'Not found' });
    res.json({ exam });
  });
}

