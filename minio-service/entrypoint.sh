#!/bin/sh

echo "Starting MINIO"

/usr/bin/minio server /data --console-address ":9001" &

# Wait until MinIO responds on port 9000
echo "Waiting for MinIO to be ready..."
until curl -s http://localhost:9000/minio/health/live | grep -q "OK"; do
  echo "Still waiting for MinIO..."
  sleep 2
done

echo "MinIO is ready. Creating buckets..."

mc alias set local http://localhost:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

for BUCKET in product-images category-images user-icons; do
  if ! mc ls local/$BUCKET > /dev/null 2>&1; then
    mc mb local/$BUCKET
    mc anonymous set download local/$BUCKET
    echo "Bucket $BUCKET created and made public."
  else
    echo "Bucket $BUCKET already exists."
  fi
done

# Keep container running
wait
