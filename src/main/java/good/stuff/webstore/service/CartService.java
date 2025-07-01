package good.stuff.webstore.service;


import good.stuff.webstore.common.model.CartItem;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private static final String CART_SESSION_KEY = "cart";

    @SuppressWarnings("unchecked")
    public List<CartItem> getCart(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    public void addItem(HttpSession session, CartItem itemToAdd) {
        List<CartItem> cart = getCart(session);
        for (CartItem item : cart) {
            if (item.getProductId().equals(itemToAdd.getProductId())) {
                item.setQuantity(item.getQuantity() + itemToAdd.getQuantity());
                return;
            }
        }
        cart.add(itemToAdd);
    }

    public void removeItem(HttpSession session, Long productId) {
        List<CartItem> cart = getCart(session);
        cart.removeIf(item -> item.getProductId().equals(productId));
    }

    public void clearCart(HttpSession session) {
        session.removeAttribute(CART_SESSION_KEY);
    }
}
