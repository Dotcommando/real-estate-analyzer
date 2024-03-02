import { IRentLimits, ISaleLimits } from '../types';


export async function fetchLimits(
  rentLimitsUrl: string,
  saleLimitsUrl: string,
): Promise<[ IRentLimits | null, ISaleLimits | null ]> {
  const [ rentLimitsResponse, saleLimitsResponse ] = await Promise.all([
    fetch(rentLimitsUrl),
    fetch(saleLimitsUrl),
  ]);

  const requests: Promise<Response>[] = [
    fetch(rentLimitsUrl),
    fetch(saleLimitsUrl),
  ];

  const results: PromiseSettledResult<Response>[] = await Promise.allSettled(requests);

  let rentLimits = null;
  let saleLimits = null;

  for (const [ index, result ] of results.entries()) {
    if (result.status === 'fulfilled' && result.value.ok) {
      try {
        const response = await result.value.json();

        if (index === 0) {
          rentLimits = response.data as IRentLimits;
        } else if (index === 1) {
          saleLimits = response.data as ISaleLimits;
        }
      } catch (error) {
        console.error(`Error parsing JSON from response: ${error}`);
      }
    } else {
      console.warn(`Failed to fetch ${index === 0 ? 'rent limits' : 'sale limits'} data`);
    }
  }

  return [ rentLimits, saleLimits ];
}
