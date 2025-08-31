import { defineFunction } from '@aws-amplify/backend';

export const documentProcessor = defineFunction({
  name: 'document-processor',
  entry: './handler.ts',
  // ✅ FIX: Add this line to resolve the circular dependency
  // This tells Amplify to deploy the function as part of the storage resource group.
  resourceGroupName: 'storage',
});

