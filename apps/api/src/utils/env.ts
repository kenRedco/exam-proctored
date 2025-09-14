export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val || val.length === 0) throw new Error(`Missing env: ${key}`);
  return val;
}

