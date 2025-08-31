// amplify/predictions/resource.ts
import { defineFunction } from '@aws-amplify/backend';

// Simple text extraction function using AWS Textract
export const predictions = defineFunction({
  name: 'textExtraction',
  entry: './textract-handler.ts',
  environment: {
    // Environment variables for Textract
  },
  timeoutSeconds: 300,
  memoryMB: 512,
});