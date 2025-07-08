package good.stuff.backend.common.model.product;

import good.stuff.backend.common.model.base.BaseEntity;
import good.stuff.backend.common.model.category.Category;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product extends BaseEntity {

    private String name;

    private String description;

    private BigDecimal price;

    private int quantity;

    private Double averageRating = 0.0; // From 1.0 to 5.0

    private int totalRatings = 0; // Number of ratings submitted

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;
}
