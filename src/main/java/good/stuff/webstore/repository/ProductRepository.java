package good.stuff.webstore.repository;

import good.stuff.webstore.common.model.Category;
import good.stuff.webstore.common.model.Product;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByCategory(Category category);
}
