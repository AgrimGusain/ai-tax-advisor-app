// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import { data } from './data/resource';
import { documentProcessor } from './functions/document-processor';

const backend = defineBackend({
  auth,
  storage,
  data,
  functions: {
    documentProcessor,
  },
});

// Grant the Lambda function access to the necessary resources
backend.functions.documentProcessor.addEnvironment('ADVICE_TABLE_NAME', backend.data.resources.tables['Advice'].tableName);

backend.functions.documentProcessor.resources.lambda.addToRolePolicy(
  new backend.functions.documentProcessor.resources.lambda.stack.aws_iam.PolicyStatement({
    effect: backend.functions.documentProcessor.resources.lambda.stack.aws_iam.Effect.ALLOW,
    actions: [
      's3:GetObject',
      'dynamodb:PutItem',
      'bedrock:InvokeModel'
    ],
    resources: [
      backend.storage.resources.bucket.bucketArn + '/*',
      backend.data.resources.tables['Advice'].tableArn,
      'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0'
    ]
  })
);

// Add S3 trigger for the document processor function
backend.storage.resources.bucket.addEventNotification(
  backend.storage.resources.bucket.stack.aws_s3.EventType.OBJECT_CREATED,
  new backend.storage.resources.bucket.stack.aws_s3_notifications.LambdaDestination(
    backend.functions.documentProcessor.resources.lambda
  ),
  {
    prefix: 'private/',
    suffix: '.pdf'
  }
);