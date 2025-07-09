package good.stuff.backend.common.dto.cart;

import good.stuff.backend.common.dto.product.ProductDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long id;
    private int quantity;
    private ProductDto product;
}
