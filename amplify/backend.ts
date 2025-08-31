// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import { predictions } from './predictions/resource';
import { data } from './data/resource'; // 👈 Import the new data resource
import { documentProcessor } from './functions/document-processor';

const backend = defineBackend({
  auth,
  storage,
  predictions,
  data, // 👈 Add the data resource here
  functions: {
    documentProcessor,
  },
});

// Grant the Lambda function access to the necessary resources
backend.functions.documentProcessor.resources.grantAccess(
  (allow) => [
    allow.storage.resource.on('read'),
    allow.predictions.resource.on('infer'),
    // ✅ NEW: Grant write access to the Advice table in our database
    allow.data.resource.on('write', ['Advice']),
  ]
);

// Pass the Advice table name to the function as an environment variable
backend.addOutput({
  custom: {
    AdviceTableName: backend.data.resources.tables.Advice.tableName,
  }
});

// Set up the trigger to run the function on file upload
backend.storage.resources.bucket.addTrigger(
  'onUpload',
  backend.functions.documentProcessor.resources.lambda
);