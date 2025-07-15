package good.stuff.backend.common.model.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import good.stuff.backend.common.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage extends BaseEntity {

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;
}

