import fs from 'fs';
import path from 'path';

import { debugError } from './debug-error.helper';
import { debugLog } from './debug-log.helper';


export async function saveToFile(collectionName: string, data: string[]): Promise<void> {
  const filePath = path.resolve(__dirname, `../dist/${collectionName}.json`);

  data.sort();

  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    debugLog(`Data saved for collection ${collectionName}`);
  } catch (error) {
    debugError(`Error saving data for collection ${collectionName}: ${error}`);
  }
}
