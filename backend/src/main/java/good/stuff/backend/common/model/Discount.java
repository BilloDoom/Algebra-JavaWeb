package good.stuff.backend.common.model;

import good.stuff.backend.common.model.base.BaseEntity;
import good.stuff.backend.common.model.category.Category;
import good.stuff.backend.common.model.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Discount extends BaseEntity {
    private String name;

    private BigDecimal percentage;

    private String description;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
