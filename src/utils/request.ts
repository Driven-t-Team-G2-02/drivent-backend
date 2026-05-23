import axios, { AxiosError } from 'axios';
import { requestError } from '@/errors';

async function get(url: string) {
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    const err = error as AxiosError;
    // eslint-disable-next-line no-console
    console.error('[request.get] failed:', {
      url,
      message: err.message,
      code: err.code,
      status: err.response?.status,
    });
    if (err.response) {
      const { status, statusText } = err.response;
      throw requestError(status, statusText);
    }
    throw requestError(503, err.message ?? 'External service unavailable');
  }
}

export const request = {
  get,
};
