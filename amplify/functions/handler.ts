// amplify/functions/handler.ts

import type { S3Event } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize AWS service clients
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });
const s3Client = new S3Client({ region: 'us-east-1' });
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Get the DynamoDB table name from environment variables
const ADVICE_TABLE_NAME = process.env.ADVICE_TABLE_NAME || '';

export const handler = async (event: S3Event) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    // Extract the user's identity ID from the S3 object key
    const pathParts = key.split('/');
    if (pathParts.length < 2) {
      throw new Error('Invalid S3 object key format');
    }
    const userId = pathParts[1];

    // 1. Get the document content from S3
    const getObjectResponse = await s3Client.send(
      new GetObjectCommand({ 
        Bucket: bucket, 
        Key: key 
      })
    );

    if (!getObjectResponse.Body) {
      throw new Error('Document body is empty');
    }

    const documentContent = await getObjectResponse.Body.transformToString();

    if (!documentContent.trim()) {
      throw new Error('Document content is empty');
    }

    // 2. Prepare the prompt for the AI model
    const prompt = `You are an expert tax advisor. Analyze the following document text and provide three actionable tax-saving tips. Format the response as a single block of text with clear, numbered recommendations.

Document Content:
---
${documentContent}
---`;

    // 3. Invoke the Bedrock AI model
    const bedrockResponse = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        contentType: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 2000,
          messages: [{ 
            role: 'user', 
            content: prompt 
          }],
        }),
      })
    );

    if (!bedrockResponse.body) {
      throw new Error('Empty response from Bedrock');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
    const extractedAdvice = responseBody.content[0]?.text;

    if (!extractedAdvice) {
      throw new Error('No advice text found in Bedrock response');
    }

    console.log('SUCCESS: Extracted advice from Bedrock:', extractedAdvice);

    // 4. Save the generated advice to the DynamoDB table
    const putCommand = new PutCommand({
      TableName: ADVICE_TABLE_NAME,
      Item: {
        id: `${userId}-${Date.now()}`,
        userId: userId,
        adviceText: extractedAdvice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: userId,
      },
    });

    await docClient.send(putCommand);
    console.log('SUCCESS: Saved advice to DynamoDB.');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Advice generated and saved successfully',
        advicePreview: extractedAdvice.substring(0, 100) + '...'
      })
    };

  } catch (error) {
    console.error('ERROR processing document:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error processing document',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};