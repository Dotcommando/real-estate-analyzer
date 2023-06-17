export async function delay(delay: number, log = console.log): Promise<void> {
  return new Promise(resolve => setTimeout(() => {
    log(` ... ${Math.round(delay / 100) / 10} sec ... `);
    resolve();
  }, delay));
}
