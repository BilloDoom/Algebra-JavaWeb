package good.stuff.backend.repository.product;

import good.stuff.backend.common.model.product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}
