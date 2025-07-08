package good.stuff.backend.common.model.product;

import good.stuff.backend.common.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_ratings")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRating extends BaseEntity {

    @Column(nullable = false)
    private int rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
