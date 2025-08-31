// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import { data } from './data/resource';
import { documentProcessor } from './functions/documentprocessor';

const backend = defineBackend({
  auth,
  storage,
  data,
  documentProcessor,
});

// Add environment variable for the DynamoDB table name
backend.documentProcessor.addEnvironment('ADVICE_TABLE_NAME', backend.data.resources.tables['Advice'].tableName);

// Grant the Lambda function access to the necessary resources
backend.documentProcessor.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
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

// Set up S3 trigger for document processing
backend.storage.resources.bucket.addEventNotification(
  EventType.OBJECT_CREATED,
  new LambdaDestination(backend.documentProcessor.resources.lambda),
  {
    prefix: 'private/',
  }
);