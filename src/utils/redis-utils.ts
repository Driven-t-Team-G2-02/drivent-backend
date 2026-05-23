import redis, { DEFAULT_EXP } from '@/config/redis';

async function getCacheKey(key: string) {
  const result = await redis.get(key);

  return JSON.parse(result);
}

async function setCacheKey(key: string, data: unknown, EXPIRY_SECONDS: number = DEFAULT_EXP) {
  const serialized = JSON.stringify(data);

  if (EXPIRY_SECONDS === 0) {
    return await redis.set(key, serialized);
  } else {
    return await redis.setEx(key, EXPIRY_SECONDS, serialized);
  }
}

// FIXME: improve logic, setting once again the given keys
export async function resetHotels(hotelId: number) {
  await redis.del('hotels');
  await redis.del(`hotel${hotelId}`);
}

export default { getCacheKey, setCacheKey, resetHotels };
