import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Use a fallback name if not present
    const fileName = `${Date.now()}-${(file as any).name || 'upload'}`;
    const bucket = process.env.AWS_BUCKET_NAME!;
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: buffer,
      ContentType: (file as any).type || 'application/octet-stream',
      ACL: 'public-read',
    }));
    const url = `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}/${fileName}`;
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('S3 upload error:', error);
    console.error('Env:', {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '***' : undefined,
      AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
      AWS_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      AWS_REGION: process.env.AWS_REGION,
    });
    return NextResponse.json({ error: 'Failed to upload file', details: error?.message }, { status: 500 });
  }
} 