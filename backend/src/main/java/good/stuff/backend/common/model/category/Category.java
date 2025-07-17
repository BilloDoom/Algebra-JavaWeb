package good.stuff.backend.common.model.category;

import good.stuff.backend.common.model.base.BaseEntity;
import good.stuff.backend.common.model.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Category extends BaseEntity {
    private String name;

    @OneToMany(mappedBy = "category")
    private List<Product> products;

    @Column(name = "image_urls", columnDefinition = "text")
    private String imageUrls;
}
