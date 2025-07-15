#!/bin/sh

echo "Starting MINIO"

/usr/bin/minio server /data --console-address ":9001" &

sleep 5

mc alias set local http://localhost:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

create_bucket() {
  BUCKET_NAME=$1
  if ! mc ls local/$BUCKET_NAME > /dev/null 2>&1; then
    mc mb local/$BUCKET_NAME
    mc anonymous set download local/$BUCKET_NAME
    echo "Bucket $BUCKET_NAME created and made public."
  else
    echo "Bucket $BUCKET_NAME already exists."
  fi
}

create_bucket "product-images"
create_bucket "category-images"
create_bucket "user-icons"

wait