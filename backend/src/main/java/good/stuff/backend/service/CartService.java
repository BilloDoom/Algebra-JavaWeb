package good.stuff.backend.service;

import good.stuff.backend.common.dto.cart.CartItemDto;
import good.stuff.backend.common.request.CartItemRequest;
import good.stuff.backend.common.model.cart.CartItem;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.repository.cart.CartItemRepository;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.repository.user.UserRepository;
import good.stuff.backend.utils.MapperUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Return list of CartItemDto for controller
    public List<CartItemDto> getCartItemsDto(Long userId) {
        User user = findUserOrThrow(userId);
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        return cartItems.stream()
                .map(item -> MapperUtils.map(item, CartItemDto.class))
                .collect(Collectors.toList());
    }

    // Add or update cart item from DTO
    public void addOrUpdateItem(Long userId, CartItemRequest request) {
        User user = findUserOrThrow(userId);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(new CartItem());

        item.setUser(user);
        item.setProduct(product);

        // If new item, quantity = request.quantity, else add request.quantity to existing quantity
        int newQuantity = (item.getId() < 0) ? request.quantity() : item.getQuantity() + request.quantity();
        item.setQuantity(newQuantity);

        cartItemRepository.save(item);
    }

    public void updateQuantity(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    public void removeItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        User user = findUserOrThrow(userId);
        List<CartItem> items = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(items);
    }

    // Merge session cart: accepts list of CartItemRequest DTOs and merges them
    public void mergeSessionCart(Long userId, List<CartItemRequest> sessionCartRequests) {
        for (CartItemRequest req : sessionCartRequests) {
            addOrUpdateItem(userId, req);
        }
    }

    // Helper method
    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Calculate total from CartItemDto list
    public BigDecimal calculateTotal(List<CartItemDto> cartItemsDto) {
        return cartItemsDto.stream()
                .map(itemDto -> itemDto.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(itemDto.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
