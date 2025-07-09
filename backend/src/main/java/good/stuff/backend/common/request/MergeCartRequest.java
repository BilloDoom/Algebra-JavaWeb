package good.stuff.backend.common.request;

import good.stuff.backend.common.model.cart.CartItem;
import good.stuff.backend.common.model.product.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class MergeCartRequest {
    private List<CartItemRequest> items;

    public List<CartItem> toCartItems() {
        return items.stream().map(i -> {
            CartItem item = new CartItem();

            Product product = new Product();
            product.setId(i.productId());

            item.setProduct(product);
            item.setQuantity(i.quantity());

            return item;
        }).collect(Collectors.toList());
    }
}
