#!/bin/sh

echo "Starting MINIO"

/usr/bin/minio server /data --console-address ":9001" &

TIMEOUT=60
START=$(date +%s)

while true; do
  if curl -I http://127.0.0.1:9000/minio/health/live | grep -q "OK"; then
    echo "MinIO is ready!"
    break
  fi

  NOW=$(date +%s)
  if [ $((NOW - START)) -ge $TIMEOUT ]; then
    echo "wating for $TIMEOUT"
    exit 1
  fis

  echo "Waiting for MinIO to be ready..."
  sleep 2
done


echo "MinIO is ready. Creating buckets..."

echo " "
echo "BUCKETS NEED TO BE SETUP MANUALLY"
echo " "
echo "For setup run:"
echo "mc alias set local <host> <user> <password>"
echo "mc mb local/<bucket-name>"
echo "mc anonymous set download local/<bucket-name>"
echo " "
echo "Needed buckets:"
for BUCKET in product-images category-images user-icons; do
  echo "$BUCKET"
done
echo " "

# mc alias set local http://localhost:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# for BUCKET in product-images category-images user-icons; do
#   if ! mc ls local/$BUCKET > /dev/null 2>&1; then
#     mc mb local/$BUCKET
#     mc anonymous set download local/$BUCKET
#     echo "Bucket $BUCKET created and made public."
#   else
#     echo "Bucket $BUCKET already exists."
#   fi
# done

wait
