package good.stuff.backend.repository.product;

import good.stuff.backend.common.model.category.Category;
import good.stuff.backend.common.model.product.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByCategory(Category category);
    @Query("SELECT p FROM Product p WHERE (:categoryId IS NULL OR p.category.id = :categoryId) AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> findByCategoryAndPrice(
            @Param("categoryId") Long categoryId,
            @Param("maxPrice") BigDecimal maxPrice
    );
}
