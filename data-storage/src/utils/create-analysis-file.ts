import { existsSync } from 'fs';
import { mkdir, open } from 'fs/promises';

import { dateInHumanReadableFormat } from './date-in-human-readable-format';


export async function createAnalysisFile(absolutePath: string, fileName: string): Promise<string> {
  const analysisFileName = `${absolutePath}/${fileName}__${dateInHumanReadableFormat(new Date(), 'YYYY_MM_DD__HH_mm_ss')}.json`;

  if (!existsSync(absolutePath)) {
    await mkdir(absolutePath, { recursive: true });
  }

  const fileHandle = await open(analysisFileName, 'a');

  await fileHandle.close();

  return analysisFileName;
}
