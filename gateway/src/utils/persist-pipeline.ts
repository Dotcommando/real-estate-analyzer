import { PipelineStage } from 'mongoose';
import { writeFileSync } from 'node:fs';


export function persistPipeline(pipelineData: any): void {
  const pipelineString = JSON.stringify(pipelineData, null, 2);
  const filePath = './pipelineResult.json';

  writeFileSync(filePath, pipelineString);
}
