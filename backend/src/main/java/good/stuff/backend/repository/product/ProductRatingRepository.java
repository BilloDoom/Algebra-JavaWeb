package good.stuff.backend.repository.product;

import good.stuff.backend.common.model.product.ProductRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {
    public List<ProductRating> findByProductId(Long productId);
}
