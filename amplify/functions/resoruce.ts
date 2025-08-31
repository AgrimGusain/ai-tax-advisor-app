import { defineFunction } from '@aws-amplify/backend';

export const documentProcessor = defineFunction({
  name: 'document-processor',
  // The code for this function will be in the 'handler.ts' file
  entry: './handler.ts',
});

