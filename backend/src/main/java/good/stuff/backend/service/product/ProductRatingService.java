package good.stuff.backend.service.product;

import good.stuff.backend.common.dto.product.ProductDto;
import good.stuff.backend.common.dto.product.ProductRatingDto;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.product.ProductRating;
import good.stuff.backend.repository.product.ProductRatingRepository;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductRatingService {

    private final ProductRepository productRepository;
    private final ProductRatingRepository ratingRepository;

    public List<ProductRatingDto> getRatingsForProduct(Long productId) {
        List<ProductRating> ratings = ratingRepository.findByProductId(productId);
        return ratings.stream()
                .map(rating -> MapperUtils.map(rating, ProductRatingDto.class))
                .collect(Collectors.toList());
    }

    public ProductRatingDto addRating(Long productId, ProductRatingDto dto) {
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found."));

        ProductRating rating = ratingRepository.save(MapperUtils.map(dto, ProductRating.class));

        int totalRatings = product.getTotalRatings() + 1;
        double totalScore = product.getAverageRating() * product.getTotalRatings() + dto.getRating();
        double newAverage = totalScore / totalRatings;

        product.setTotalRatings(totalRatings);
        product.setAverageRating(newAverage);
        productRepository.save(product);

        return MapperUtils.map(rating, ProductRatingDto.class);
    }
}