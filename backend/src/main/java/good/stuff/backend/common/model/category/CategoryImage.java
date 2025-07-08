package good.stuff.backend.common.model.category;

import good.stuff.backend.common.model.base.BaseEntity;
import good.stuff.backend.common.model.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "category_images")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryImage extends BaseEntity {

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
}
