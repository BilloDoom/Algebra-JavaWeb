package good.stuff.backend.controller.product;

import good.stuff.backend.common.model.product.ProductImage;
import good.stuff.backend.service.product.ProductImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/images")
public class ProductImageController {

    private final ProductImageService productImageService;

    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ProductImage> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) throws IOException {

        ProductImage image = productImageService.uploadImage(productId, file);
        return ResponseEntity.ok(image);
    }

    @GetMapping
    public ResponseEntity<List<ProductImage>> getImages(@PathVariable Long productId) {
        List<ProductImage> images = productImageService.getImagesByProduct(productId);
        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
