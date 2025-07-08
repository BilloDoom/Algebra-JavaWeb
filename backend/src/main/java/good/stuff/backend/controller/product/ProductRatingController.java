package good.stuff.backend.controller.product;

import good.stuff.backend.common.dto.product.ProductRatingDto;
import good.stuff.backend.service.product.ProductRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/ratings")
@RequiredArgsConstructor
public class ProductRatingController {

    private final ProductRatingService ratingService;

    @GetMapping
    public ResponseEntity<List<ProductRatingDto>> getRatings(@PathVariable Long productId) {
        return ResponseEntity.ok(ratingService.getRatingsForProduct(productId));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<ProductRatingDto> addRating(@PathVariable Long productId,
                                                      @RequestBody ProductRatingDto ratingDto) {
        return ResponseEntity.ok(ratingService.addRating(productId, ratingDto));
    }
}