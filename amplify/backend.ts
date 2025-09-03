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
backend.documentProcessor.addEnvironment(
  'ADVICE_TABLE_NAME', 
  backend.data.resources.tables['Advice'].tableName
);

// Get the current AWS region from the backend
const region = backend.data.resources.graphqlApi.env.region;

// Grant the Lambda function access to the necessary resources
backend.documentProcessor.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      's3:GetObject',
      'dynamodb:PutItem',
      'dynamodb:GetItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
      'dynamodb:Query',
      'dynamodb:Scan'
    ],
    resources: [
      backend.storage.resources.bucket.bucketArn + '/*',
      backend.data.resources.tables['Advice'].tableArn,
      backend.data.resources.tables['Advice'].tableArn + '/index/*'
    ]
  })
);

// Grant Bedrock access with dynamic region
backend.documentProcessor.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel'
    ],
    resources: [
      `arn:aws:bedrock:${region}::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
      `arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`
    ]
  })
);

// Add region environment variable to Lambda
backend.documentProcessor.addEnvironment('AWS_REGION_CUSTOM', region);

// Set up S3 trigger for document processing
backend.storage.resources.bucket.addEventNotification(
  EventType.OBJECT_CREATED,
  new LambdaDestination(backend.documentProcessor.resources.lambda),
  {
    prefix: 'private/',
    suffix: '.pdf'
  }
);

// Also trigger on other common document formats
backend.storage.resources.bucket.addEventNotification(
  EventType.OBJECT_CREATED,
  new LambdaDestination(backend.documentProcessor.resources.lambda),
  {
    prefix: 'private/',
    suffix: '.doc'
  }
);

backend.storage.resources.bucket.addEventNotification(
  EventType.OBJECT_CREATED,
  new LambdaDestination(backend.documentProcessor.resources.lambda),
  {
    prefix: 'private/',
    suffix: '.docx'
  }
);

backend.storage.resources.bucket.addEventNotification(
  EventType.OBJECT_CREATED,
  new LambdaDestination(backend.documentProcessor.resources.lambda),
  {
    prefix: 'private/',
    suffix: '.txt'
  }
);