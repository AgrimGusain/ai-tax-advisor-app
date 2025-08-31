// amplify/functions/document-processor.ts

import { defineFunction } from '@aws-amplify/backend';

export const documentProcessor = defineFunction({
  name: 'document-processor',
  entry: './handler.ts',
  runtime: 20,
  timeoutSeconds: 300,
  memoryMB: 1024
});