import { minio } from './minioClient';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getProductById, updateProduct } from './api'; // Use product APIs

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(productId, file) {
    const filePath = `public/${Date.now()}-${file.name}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
    });

    try {
        await minio.send(command);
    } catch (err) {
        throw new Error(`Upload failed: ${err.message}`);
    }

    const publicUrl = `http://localhost:9000/${BUCKET_NAME}/${filePath}`;

    // Fetch current product
    const product = await getProductById(productId);

    // Extract current images list or initialize if none
    const images = Array.isArray(product.images) ? product.images : [];

    // Add new image URL
    images.push(publicUrl);

    // Update product with new images list
    const updatedProduct = { ...product, images };
    await updateProduct(productId, updatedProduct);

    return publicUrl;
}

export async function deleteProductImageWithStorage(productId, imageUrl) {
    // Extract key/path from URL
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

    // Fetch current product
    const product = await getProductById(productId);
    const images = Array.isArray(product.images) ? product.images : [];

    // Remove image URL
    const updatedImages = images.filter(url => url !== imageUrl);

    // Update product with new images list
    const updatedProduct = { ...product, images: updatedImages };
    await updateProduct(productId, updatedProduct);
}
