import { S3Client } from '@aws-sdk/client-s3';

export const minio = new S3Client({
  endpoint: "https://algebra-javaweb-image-service.onrender.com",
  region: "eu-central-1",
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
  },
  forcePathStyle: true,
});