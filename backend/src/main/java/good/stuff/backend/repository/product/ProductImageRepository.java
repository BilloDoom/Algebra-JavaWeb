package good.stuff.backend.repository.product;

import good.stuff.backend.common.model.product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findAllByProductId(Long productId);
}
