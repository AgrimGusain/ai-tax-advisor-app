// amplify/functions/handler.ts

import type { S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize AWS service clients
const s3Client = new S3Client({ region: 'us-east-1' });
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Get environment variables from your amplify/backend.ts file
const ADVICE_TABLE_NAME = process.env.ADVICE_TABLE_NAME || '';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';

export const handler = async (event: S3Event) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key is not configured. Please set it using "npx ampx sandbox secret set PERPLEXITY_API_KEY"');
  }

  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    const pathParts = key.split('/');
    if (pathParts.length < 2) throw new Error('Invalid S3 object key format');
    const userId = pathParts[1];

    // 1. Get the document content from S3
    const getObjectResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    if (!getObjectResponse.Body) throw new Error('Document body is empty');
    const documentContent = await getObjectResponse.Body.transformToString();

    // 2. Prepare the prompt for the Perplexity AI model
    const prompt = `You are an expert tax advisor. Analyze the following document and provide three actionable tax-saving tips. Format the response as a single block of text with clear, numbered recommendations. Document Content: --- ${documentContent} ---`;

    // 3. Invoke the Perplexity AI model
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3-sonar-large-32k-online',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!perplexityResponse.ok) {
      const errorBody = await perplexityResponse.text();
      throw new Error(`Perplexity API error: ${perplexityResponse.status} ${errorBody}`);
    }

    const responseBody = await perplexityResponse.json();
    const extractedAdvice = responseBody.choices[0]?.message?.content;

    if (!extractedAdvice) throw new Error('No advice text found in Perplexity response');
    console.log('SUCCESS: Extracted advice from Perplexity:', extractedAdvice);

    // 4. Save the advice to DynamoDB
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

    return { statusCode: 200, body: JSON.stringify({ message: 'Advice generated and saved' }) };

  } catch (error) {
    console.error('ERROR processing document:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error processing document',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};