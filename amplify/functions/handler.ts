// amplify/functions/handler.ts

import { S3Event } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize AWS service clients
const bedrockClient = new BedrockRuntimeClient();
const s3Client = new S3Client();
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Get the DynamoDB table name from environment variables (set by Amplify)
const ADVICE_TABLE_NAME = process.env.ADVICE_TABLE_NAME!;

export const handler = async (event: S3Event): Promise<any> => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  // Extract the user's identity ID from the S3 object key
  const userId = key.split('/')[1];

  try {
    // 1. Get the document content from S3
    const { Body } = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const documentContent = await Body?.transformToString();

    if (!documentContent) throw new Error('Document is empty.');

    // 2. Prepare the prompt for the AI model
    const prompt = `You are an expert tax advisor. Analyze the following document text and provide three actionable tax-saving tips. Format the response as a single block of text. Document Content: --- ${documentContent} ---`;

    // 3. Invoke the Bedrock AI model
    const response = await bedrockClient.send(new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      contentType: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const extractedAdvice = responseBody.content[0].text;

    console.log('SUCCESS: Extracted advice from Bedrock:', extractedAdvice);

    // 4. ✅ NEW: Save the generated advice to the DynamoDB table
    const putCommand = new PutCommand({
      TableName: ADVICE_TABLE_NAME,
      Item: {
        id: `${userId}-${Date.now()}`, // Create a unique ID
        userId: userId,
        adviceText: extractedAdvice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: userId, // Set the owner for authorization
      },
    });

    await docClient.send(putCommand);
    console.log('SUCCESS: Saved advice to DynamoDB.');

    return { statusCode: 200, body: 'Advice generated and saved.' };

  } catch (error) {
    console.error('ERROR:', error);
    return { statusCode: 500, body: 'Error processing document.' };
  }
};