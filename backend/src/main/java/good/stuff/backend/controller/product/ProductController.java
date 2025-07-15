package good.stuff.backend.controller.product;

import good.stuff.backend.common.dto.product.ProductDto;
import good.stuff.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Double priceMin,
            @RequestParam(required = false, defaultValue = "1000") Double priceMax
    ) {
        return ResponseEntity.ok(productService.getFilteredProducts(categoryId, priceMin, priceMax));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<ProductDto>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<String>> getProductImageUrls(@PathVariable Long id) {
        List<String> imageUrls = productService.getProductImageUrls(id);
        return ResponseEntity.ok(imageUrls);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/images")
    public ResponseEntity<ProductDto> updateProductImages(
            @PathVariable Long id,
            @RequestBody List<String> imageUrls
    ) {
        ProductDto updatedProduct = productService.updateProductImages(id, imageUrls);
        return ResponseEntity.ok(updatedProduct);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id,
                                                    @RequestBody ProductDto request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
