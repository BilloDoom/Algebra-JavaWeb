package good.stuff.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class BackblazeB2Service {

    @Value("${backblaze.b2.keyId}")
    private String keyId;

    @Value("${backblaze.b2.applicationKey}")
    private String applicationKey;

    @Value("${backblaze.b2.bucketName}")
    private String bucketName;
/*
    private B2StorageClient b2StorageClient;
    private String bucketId;

    @PostConstruct
    public void init() throws B2Exception {
        b2StorageClient = B2StorageClient.builder(keyId, applicationKey).build();

        bucketId = b2StorageClient
                .getBuckets()
                .stream()
                .filter(b -> b.getBucketName().equals(bucketName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Bucket not found"))
                .getBucketId();
    }

    @PreDestroy
    public void close() {
        if (b2StorageClient != null) {
            b2StorageClient.close();
        }
    }

    public String uploadFile(MultipartFile file) throws IOException, B2Exception {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        B2UploadFileRequest request = B2UploadFileRequest
                .builder(bucketId, fileName, file.getContentType(), file.getInputStream())
                .setContentLength(file.getSize())
                .build();

        B2UploadFileResponse response = b2StorageClient.uploadSmallFile(request);

        return "https://f000.backblazeb2.com/file/" + bucketName + "/" + response.getFileName();
    }

 */
}