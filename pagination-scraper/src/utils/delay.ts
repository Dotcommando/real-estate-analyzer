import { Mode } from '../constants';


export async function delay(delay: number, mode = Mode.Prod): Promise<void> {
  return mode === Mode.Prod
    ? new Promise(resolve => setTimeout(resolve, delay))
    : new Promise(resolve => setTimeout(() => {
      console.log(` ... ${Math.round(delay / 100) / 10} sec ... `);
      resolve();
    }, delay));
}
