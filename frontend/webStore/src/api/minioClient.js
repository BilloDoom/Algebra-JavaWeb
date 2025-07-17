import { S3Client } from '@aws-sdk/client-s3';

export const minio = new S3Client({
  endpoint: "http://127.0.0.1:9000",
  region: "eu-central-1",
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
  },
  forcePathStyle: true,
});