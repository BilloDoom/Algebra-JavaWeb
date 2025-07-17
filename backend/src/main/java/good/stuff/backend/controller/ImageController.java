package good.stuff.backend.controller;

import good.stuff.backend.service.MinioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final MinioService minioService;

    public ImageController(MinioService minioService) {
        this.minioService = minioService;
    }
/*
    @GetMapping("/{bucket}/{folder}")
    public ResponseEntity<?> listImages(
            @PathVariable String bucket,
            @PathVariable String folder
    ) {
        try {
            List<String> imageUrls = minioService.listFiles(bucket, folder);
            return ResponseEntity.ok(Map.of("images", imageUrls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Listing failed: " + e.getMessage());
        }
    }
*/
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload/{bucket}/{folder}")
    public ResponseEntity<?> uploadImage(
            @PathVariable String bucket,
            @PathVariable String folder,
            @RequestParam MultipartFile file
    ) {
        try {
            String imageUrl = minioService.uploadFile(bucket, file, folder);

            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteImage(
            @RequestParam String bucket,
            @RequestParam String objectPath
    ) {
        try {
            minioService.deleteFile(bucket, objectPath);
            return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Delete failed: " + e.getMessage());
        }
    }
}

