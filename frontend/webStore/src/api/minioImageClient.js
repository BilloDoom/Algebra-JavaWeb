// src/api/minioImageClient.js
import { minio } from './minioClient';
import {
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { addProductImage, deleteProductImage } from './api';

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(productId, file) {
    const filePath = `public/${Date.now()}-${file.name}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: new Uint8Array(arrayBuffer), // pass Uint8Array
        ContentType: file.type,
    });

    try {
        await minio.send(command);
    } catch (err) {
        throw new Error(`Upload failed: ${err.message}`);
    }

    const publicUrl = `http://localhost:9000/${BUCKET_NAME}/${filePath}`;
    await addProductImage(productId, publicUrl);

    return publicUrl;
}

export async function deleteProductImageWithStorage(productId, imageId, imageUrl) {
    const pathStart = imageUrl.indexOf(`${BUCKET_NAME}/`) + `${BUCKET_NAME}/`.length;
    const filePath = imageUrl.substring(pathStart);

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
    });

    try {
        await minio.send(command);
    } catch (err) {
        throw new Error(`Delete failed: ${err.message}`);
    }

    await deleteProductImage(productId, imageId);
}
