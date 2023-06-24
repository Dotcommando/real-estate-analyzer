import { existsSync } from 'fs';
import { mkdir, open } from 'fs/promises';

import { dateInHumanReadableFormat } from './date-in-human-readable-format';


export async function createDumpFile(absolutePath: string, collectionName: string, ext: 'json' | 'csv' = 'json'): Promise<string> {
  const dumpFileName = `${absolutePath}/${collectionName}__${dateInHumanReadableFormat(new Date(), 'YYYY_MM_DD__HH_mm_ss')}.${ext}`;

  if (!existsSync(absolutePath)) {
    await mkdir(absolutePath, { recursive: true });
  }

  const fileHandle = await open(dumpFileName, 'a');

  await fileHandle.close();

  return dumpFileName;
}
