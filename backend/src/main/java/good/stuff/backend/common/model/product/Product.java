package good.stuff.backend.common.model.product;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    private Double averageRating = 0.0;

    private int totalRatings = 0;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String imageUrls;
}
