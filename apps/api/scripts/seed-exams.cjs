// Simple seeding script for ExamType
// Usage: npm run seed -w apps/api

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const ExamTypeSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  provider: String,
  durationMinutes: Number,
  prepCategory: String,
  requirements: [String],
  basePrice: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  enabled: { type: Boolean, default: true },
}, { timestamps: true });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(uri);
  const ExamType = mongoose.model('ExamType', ExamTypeSchema);

  const seed = [
    { slug: 'toefl', name: 'TOEFL', provider: 'ETS', durationMinutes: 120, basePrice: 20000, currency: 'USD', enabled: true },
    { slug: 'ielts', name: 'IELTS', provider: 'IDP/BC', durationMinutes: 170, basePrice: 20000, currency: 'USD', enabled: true },
    { slug: 'capm', name: 'CAPM', provider: 'PMI', durationMinutes: 180, basePrice: 25000, currency: 'USD', enabled: true },
    { slug: 'teas', name: 'TEAS', provider: 'ATI', durationMinutes: 180, basePrice: 18000, currency: 'USD', enabled: true },
    { slug: 'hesi', name: 'HESI', provider: 'Elsevier', durationMinutes: 180, basePrice: 18000, currency: 'USD', enabled: true },
  ];

  for (const e of seed) {
    await ExamType.updateOne({ slug: e.slug }, { $setOnInsert: e }, { upsert: true });
    console.log(`Upserted exam: ${e.slug}`);
  }
}

main()
  .then(() => mongoose.disconnect())
  .then(() => console.log('Seeding complete'))
  .catch((err) => { console.error(err); process.exit(1); });
