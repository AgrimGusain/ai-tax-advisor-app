// amplify/functions/documentprocessor.ts

import { defineFunction } from '@aws-amplify/backend';

export const documentProcessor = defineFunction({
  name: 'document-processor',
  entry: './handler.ts',
  resourceGroupName: 'storage',
  // ✅ ADD THESE TWO LINES
  timeoutSeconds: 30, // Increase timeout to 30 seconds
  memoryMB: 512,      // Increase memory to 512 MB
});