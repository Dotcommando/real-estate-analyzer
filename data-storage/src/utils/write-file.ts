import { open } from 'fs/promises';

import { debugError } from './debug-error.helper';
import { debugLog } from './debug-log.helper';


export async function writeFile(
  absoluteFilePath: string,
  data: { [key: string]: unknown },
): Promise<void> {
  const fileHandle = await open(absoluteFilePath, 'w');

  try {
    await fileHandle.appendFile(JSON.stringify(data, null, 2), 'utf8');

    debugLog(`Writing of file ${absoluteFilePath} completed.`);

    await fileHandle.close();

    return;
  } catch (e) {
    debugError(e);

    if (fileHandle) {
      await fileHandle.close();
    }

    return;
  }
}
