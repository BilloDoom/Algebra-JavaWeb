import { createClient } from '@supabase/supabase-js';
import { addProductImage, deleteProductImage } from './api';

const SUPABASE_URL = "https://ukmthbjjoszeniuofldq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbXRoYmpqb3N6ZW5pdW9mbGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTgwMDQsImV4cCI6MjA2MjAzNDAwNH0.a6lGwEjbmCChIPs5mlfeS8NI3ij0dIznOs0TqZp_X6k";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(productId, file) {
    const filePath = `public/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    await addProductImage(productId, publicUrl);

    return publicUrl;
}

export async function deleteProductImageWithStorage(productId, imageId, imageUrl) {
    const pathStart = imageUrl.indexOf(`${BUCKET_NAME}/`) + `${BUCKET_NAME}/`.length;
    const filePath = imageUrl.substring(pathStart);

    const { error: storageError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove([filePath]);

    if (storageError) throw new Error(`Storage deletion failed: ${storageError.message}`);

    await deleteProductImage(productId, imageId);
}
