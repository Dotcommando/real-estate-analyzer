import { fallBackRentLimits, fallBackSaleLimits } from '../fall-backs';
import { IRentLimits, IResponse, ISaleLimits } from '../types';


function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out: ${url}`));
    }, timeout);

    fetch(url)
      .then(resolve, reject)
      .finally(() => clearTimeout(timer));
  });
}

async function parseResponse<T>(response: Response, fallback: T): Promise<T> {
  if (response.ok) {
    try {
      const json = await response.json() as IResponse<T>;

      return json.data as T;
    } catch (error) {
      console.error(`Error parsing JSON from response: ${error}`);
    }
  } else {
    console.warn(`Failed to fetch data with status: ${response.status}`);
  }

  return fallback;
}

export async function fetchLimits(
  rentLimitsUrl: string,
  saleLimitsUrl: string,
  timeout: number,
): Promise<[IRentLimits | null, ISaleLimits | null]> {
  const rentResponsePromise = fetchWithTimeout(rentLimitsUrl, timeout);
  const saleResponsePromise = fetchWithTimeout(saleLimitsUrl, timeout);
  const results = await Promise.allSettled([ rentResponsePromise, saleResponsePromise ]);
  const rentResult = results[0];
  const saleResult = results[1];

  const rentLimits = rentResult.status === 'fulfilled'
    ? await parseResponse<IRentLimits | null>(rentResult.value, fallBackRentLimits)
    : fallBackRentLimits;

  const saleLimits = saleResult.status === 'fulfilled'
    ? await parseResponse<ISaleLimits | null>(saleResult.value, fallBackSaleLimits)
    : fallBackSaleLimits;

  return [ rentLimits, saleLimits ];
}
