export async function delay(delay: number): Promise<number> {
  return new Promise(resolve => setTimeout(() => {
    resolve(delay);
  }, delay));
}
