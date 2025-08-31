// amplify/functions/document-processor.ts

import { defineFunction } from '@aws-amplify/backend';

export const documentProcessor = defineFunction({
  name: 'document-processor',
  // We will add the code for this handler in the next step
  entry: './handler.ts', 
});