package good.stuff.backend.service;

import good.stuff.backend.common.model.cart.CartItem;
import good.stuff.backend.common.model.product.Product;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SessionCartService {

    private static final String SESSION_CART_KEY = "cart";

    public List<CartItem> getCart(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute(SESSION_CART_KEY);
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute(SESSION_CART_KEY, cart);
        }
        return cart;
    }
/*
    public void addOrUpdateItem(HttpSession session, Product product, int quantity) {
        List<CartItem> cart = getCart(session);
        Optional<CartItem> existing = cart.stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.add(item);
        }
    }

    public void updateQuantity(HttpSession session, Long productId, int quantity) {
        List<CartItem> cart = getCart(session);
        cart.stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(i -> i.setQuantity(quantity));
    }

    public void removeItem(HttpSession session, Long productId) {
        List<CartItem> cart = getCart(session);
        cart.removeIf(i -> i.getProduct().getId().equals(productId));
    }

    public void clearCart(HttpSession session) {
        session.removeAttribute(SESSION_CART_KEY);
    }

 */
}

