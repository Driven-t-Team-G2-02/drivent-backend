import { createClient } from 'redis';
import { loadEnv } from './envs';

loadEnv();

export const DEFAULT_EXP = 1800;

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Redis Client Error:', err);
});

export async function connectRedis() {
  return await redis.connect();
}

export async function disconnectRedis() {
  return await redis.disconnect();
}

export default redis;
