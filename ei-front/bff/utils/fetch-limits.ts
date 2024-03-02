import { IRentLimits, IResponse, ISaleLimits } from '../types';


function fetchWithTimeout(url: string, timeout: number) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out: ${url}`));
    }, timeout);

    fetch(url)
      .then(response => resolve(response))
      .catch(error => reject(error))
      .finally(() => clearTimeout(timer));
  });
}

export async function fetchLimits(
  rentLimitsUrl: string,
  saleLimitsUrl: string,
  timeout: number,
): Promise<[ IRentLimits | null, ISaleLimits | null ]> {
  const requests = [
    fetchWithTimeout(rentLimitsUrl, timeout),
    fetchWithTimeout(saleLimitsUrl, timeout),
  ];
  const results = await Promise.allSettled(requests);

  let rentLimits = null;
  let saleLimits = null;

  for (const [ index, result ] of results.entries()) {
    if (result.status !== 'fulfilled') {
      console.warn(`Failed to fetch ${index === 0 ? 'rent limits' : 'sale limits'} data: ${result.reason}`);

      continue;
    }

    const response = (result as PromiseFulfilledResult<Response>).value;

    if (response.ok) {
      try {
        const parsedResponse = await response.json();

        if (index === 0) {
          rentLimits = (parsedResponse as IResponse<IRentLimits>).data;
        } else if (index === 1) {
          saleLimits = (parsedResponse as IResponse<ISaleLimits>).data;
        }
      } catch (error) {
        console.error(`Error parsing JSON from response: ${error}`);
      }
    } else {
      console.warn(`Failed to fetch ${index === 0 ? 'rent limits' : 'sale limits'} data with status: ${response.status}`);
    }
  }

  return [ rentLimits, saleLimits ];
}
