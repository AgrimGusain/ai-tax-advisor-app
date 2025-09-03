// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import { data } from './data/resource';
import { documentProcessor } from './functions/documentprocessor';
import { EC2Stack } from './custom/ec2-stack';
import { IAMStack } from './custom/iam-stack';
import { Stack } from 'aws-cdk-lib';


const deployEC2AndIAMStacks = false;

const backend = defineBackend({
  auth,
  storage,
  data,
  documentProcessor,
});

if (deployEC2AndIAMStacks) {
  new EC2Stack(backend.stack, 'EC2ApplicationStack');
  new IAMStack(backend.stack, 'IAMResourcesStack');
}

// ✅ Add environment variable for the DynamoDB table name
backend.documentProcessor.addEnvironment(
  'ADVICE_TABLE_NAME',
  backend.data.resources.tables['Advice'].tableName
);

// ✅ Use Amplify environment region instead of graphqlApi.env.region
const region = Stack.of(backend.stack).region;

// ✅ Grant the Lambda function access to S3 + DynamoDB
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
      'dynamodb:Scan',
    ],
    resources: [
      `${backend.storage.resources.bucket.bucketArn}/*`,
      backend.data.resources.tables['Advice'].tableArn,
      `${backend.data.resources.tables['Advice'].tableArn}/index/*`,
    ],
  })
);

// ✅ Grant Bedrock model invoke permissions (dynamic region + us-east-1 fallback)
backend.documentProcessor.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['bedrock:InvokeModel'],
    resources: [
      `arn:aws:bedrock:${region}::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
      `arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
    ],
  })
);

// ✅ Add region as environment variable for Lambda
backend.documentProcessor.addEnvironment('AWS_REGION_CUSTOM', region);

// ✅ Setup S3 triggers for supported document types
const docSuffixes = ['.pdf', '.doc', '.docx', '.txt'];

for (const suffix of docSuffixes) {
  backend.storage.resources.bucket.addEventNotification(
    EventType.OBJECT_CREATED,
    new LambdaDestination(backend.documentProcessor.resources.lambda),
    {
      prefix: 'private/',
      suffix,
    }
  );
}
