package good.stuff.backend.common.model.cart;

import com.fasterxml.jackson.annotation.JsonBackReference;
import good.stuff.backend.common.model.base.BaseEntity;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cartItem")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItem extends BaseEntity {
    @ManyToOne
    @JsonBackReference
    private User user;

    @ManyToOne(optional = false)
    private Product product;

    private int quantity;
}