// amplify/functions/documentprocessor.ts

import { defineFunction } from '@aws-amplify/backend';

export const documentProcessor = defineFunction({
  name: 'documentProcessor',
  entry: './handler.ts',
  environment: {
    // Environment variables will be added by backend.ts
  },
  timeoutSeconds: 300, // 5 minutes timeout for document processing
  memoryMB: 512, // Sufficient memory for document processing
});