// amplify/predictions/textract-handler.ts
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const textractClient = new TextractClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  const { bucket, key } = event;
  
  try {
    // Use Textract to extract text from document
    const command = new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: bucket,
          Name: key,
        },
      },
    });

    const response = await textractClient.send(command);
    
    // Extract text from Textract response
    const extractedText = response.Blocks
      ?.filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n') || '';

    return {
      statusCode: 200,
      body: JSON.stringify({
        extractedText,
        confidence: 'high', // You can calculate average confidence from blocks
      }),
    };

  } catch (error) {
    console.error('Textract error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Text extraction failed' }),
    };
  }
};