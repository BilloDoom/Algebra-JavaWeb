import { minio } from './minioClient';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getProductById, updateProduct } from './api';

const PRODUCT_BUCKET_NAME = 'product-images';
const CATEGORY_BUCKET_NAME = 'category-images';
const BASE_URL = "http://127.0.0.1:9000";

export async function uploadProductImage(productId, file) {
    const filePath = `public/${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
        Bucket: PRODUCT_BUCKET_NAME,
        Key: filePath,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
    });

    try {
        await minio.send(command);
    } catch (err) {
        throw new Error(`Upload failed: ${err.message}`);
    }

    const publicUrl = `${BASE_URL}/${PRODUCT_BUCKET_NAME}/${filePath}`;

    const product = await getProductById(productId);

    const images = Array.isArray(product.images) ? product.images : [];

    images.push(publicUrl);

    const updatedProduct = { ...product, images };
    await updateProduct(productId, updatedProduct);

    return publicUrl;
}

export async function deleteProductImageWithStorage(productId, imageUrl) {
    const pathStart = imageUrl.indexOf(`${PRODUCT_BUCKET_NAME}/`) + `${PRODUCT_BUCKET_NAME}/`.length;
    const filePath = imageUrl.substring(pathStart);

    const command = new DeleteObjectCommand({
        Bucket: PRODUCT_BUCKET_NAME,
        Key: filePath,
    });

    try {
        await minio.send(command);
    } catch (err) {
        throw new Error(`Delete failed: ${err.message}`);
    }

    const product = await getProductById(productId);
    const images = Array.isArray(product.images) ? product.images : [];

    const updatedImages = images.filter(url => url !== imageUrl);

    const updatedProduct = { ...product, images: updatedImages };
    await updateProduct(productId, updatedProduct);
}

export async function uploadCategoryImage(categoryId, file) {
    const filePath = `public/${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
        Bucket: CATEGORY_BUCKET_NAME,
        Key: filePath,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
    });

    try {
        await minio.send(command);
    } catch (err) {
        throw new Error(`Upload failed: ${err.message}`);
    }

    const publicUrl = `${BASE_URL}/${CATEGORY_BUCKET_NAME}/${filePath}`;

    const category = await getCategoryById(categoryId);

    const images = Array.isArray(category.images) ? category.images : [];

    images.push(publicUrl);

    const updatedCategory = { ...category, images };
    await updateCategory(categoryId, updatedCategory);

    return publicUrl;
}

