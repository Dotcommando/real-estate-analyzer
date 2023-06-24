import { open } from 'fs/promises';
import { Document } from 'mongoose';

import { getArrayIterator } from './array-async-iterator';
import { debugError } from './debug-error.helper';
import { debugLog } from './debug-log.helper';
import { getModelByCollectionName } from './get-model-by-collection-name';
import { serializeDoc } from './serialize-doc';


export async function makeDumpOfCollection(
  absoluteDumpFilePath: string,
  collectionName: string,
  batchSize = 500,
): Promise<number> {
  const fileHandle = await open(absoluteDumpFilePath, 'w');

  try {
    const model = getModelByCollectionName(collectionName);
    const documentsNumber = await model.countDocuments();

    if (!documentsNumber) {
      debugLog('No documents to save found.');

      return 0;
    }

    const stepsNumber = Math.ceil(documentsNumber / batchSize);
    const steps = [];

    for (let i = 0; i < stepsNumber; i++) {
      steps.push(i);
    }

    await fileHandle.writeFile('[', 'utf8');

    const stepsIterator = getArrayIterator(steps);

    for await (const step of stepsIterator) {
      const docs = await model.find({})
        .skip(step * batchSize)
        .limit(batchSize);

      const serializedDocs = docs.map((doc: Document) => serializeDoc(doc));
      let dataToAppend = JSON.stringify(serializedDocs, null, 2)
        .slice(1, -1)
        .replace(/\n$/, '');

      if (step !== stepsNumber - 1) {
        dataToAppend = dataToAppend + ',';
      }

      await fileHandle.appendFile(dataToAppend);
    }

    await fileHandle.appendFile('\n]', 'utf8');

    debugLog(collectionName, documentsNumber);

    await fileHandle.close();

    return documentsNumber;
  } catch (e) {
    debugError(e);

    if (fileHandle) {
      await fileHandle.close();
    }

    return 0;
  }
}
