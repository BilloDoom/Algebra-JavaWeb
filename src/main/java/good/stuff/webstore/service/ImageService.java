package good.stuff.webstore.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String apiKey;

    @Value("${supabase.bucket-images}")
    private String bucketImages;

    @Value("${supabase.bucket-user-profile-images}")
    private String bucketUsers;

    @Value("${supabase.bucket-category-images}")
    private String bucketCategories;

    private final RestTemplate restTemplate;

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String minioBucketName;

    @Value("${minio.endpoint}")
    private String minioEndpoint;

    public ImageService(RestTemplate restTemplate, MinioClient minioClient) {
        this.restTemplate = restTemplate;
        this.minioClient = minioClient;
    }

    public String uploadToMinio(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file.");
        }

        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(minioBucketName)
                    .build());

            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(minioBucketName)
                        .build());
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioBucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String endpoint = minioEndpoint.endsWith("/") ? minioEndpoint.substring(0, minioEndpoint.length() - 1) : minioEndpoint;

            return endpoint + "/" + minioBucketName + "/" + fileName;

        } catch (MinioException | InvalidKeyException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Error occurred while uploading to MinIO", e);
        }
    }

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public String uploadToDataBaseLocal(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file.");
        }

        // Ensure the uploads directory exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path targetPath = uploadPath.resolve(uniqueFileName);

        // Save the file to the local path
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path used by frontend (e.g., for <img src="...">)
        return "/uploads/" + uniqueFileName;
    }

    public String uploadToDataBase(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String url = supabaseUrl + "/storage/v1/object/" + bucketImages + "/" + fileName;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", apiKey);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return supabaseUrl + "/storage/v1/object/public/" + bucketImages + "/" + fileName;
        } else {
            throw new RuntimeException("Failed to upload image: " + response.getStatusCode());
        }
    }
}
