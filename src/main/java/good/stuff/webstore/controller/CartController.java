package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.CartItem;
import good.stuff.webstore.common.model.Product;
import good.stuff.webstore.common.model.order.Order;
import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.repository.ProductRepository;
import good.stuff.webstore.repository.user.UserRepository;
import good.stuff.webstore.service.CartService;
import good.stuff.webstore.service.SessionCartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final SessionCartService sessionCartService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartController(CartService cartService,
                          SessionCartService sessionCartService,
                          ProductRepository productRepository,
                          UserRepository userRepository) {
        this.cartService = cartService;
        this.sessionCartService = sessionCartService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String viewCart(Model model, Principal principal, HttpSession session) {
        List<CartItem> cartItems;
        if (principal != null) {
            User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user != null) {
                // Merge session cart if any, then clear session
                List<CartItem> sessionCart = sessionCartService.getCart(session);
                if (!sessionCart.isEmpty()) {
                    cartService.mergeSessionCart(user.getId(), sessionCart);
                    sessionCartService.clearCart(session);
                }
                cartItems = cartService.getCartByUser(user.getId());
            } else {
                cartItems = sessionCartService.getCart(session);
            }
        } else {
            cartItems = sessionCartService.getCart(session);
        }
        model.addAttribute("cartItems", cartItems);

        BigDecimal total = cartItems.stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        model.addAttribute("total", total);
        return "cart/cart-view";
    }

    @PostMapping("/add/{productId}")
    public String addToCart(@PathVariable Long productId,
                            @RequestParam(defaultValue = "1") int quantity,
                            Principal principal,
                            HttpSession session) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (principal != null) {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cartService.addOrUpdateItem(user.getId(), productId, quantity);
        } else {
            sessionCartService.addOrUpdateItem(session, product, quantity);
        }
        return "redirect:/cart";
    }

    @PostMapping("/update")
    public String updateQuantities(@RequestParam Map<String, String> allParams,
                                   Principal principal,
                                   HttpSession session) {
        // Filter params starting with "quantities[" and extract productId and quantity
        allParams.entrySet().stream()
                .filter(e -> e.getKey().startsWith("quantities["))
                .forEach(e -> {
                    // Key looks like "quantities[123]"
                    String key = e.getKey();
                    String productIdStr = key.substring("quantities[".length(), key.length() - 1);
                    Long productId = Long.parseLong(productIdStr);
                    int quantity = Integer.parseInt(e.getValue());

                    if (principal != null) {
                        User user = userRepository.findByUsername(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                        List<CartItem> items = cartService.getCartByUser(user.getId());
                        for (CartItem item : items) {
                            if (item.getProduct().getId().equals(productId)) {
                                cartService.updateQuantity(item.getId(), quantity);
                                break;
                            }
                        }
                    } else {
                        sessionCartService.updateQuantity(session, productId, quantity);
                    }
                });

        return "redirect:/cart";
    }


    @PostMapping("/remove")
    public String removeItem(@RequestParam Long productId, Principal principal, HttpSession session) {
        if (principal != null) {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<CartItem> items = cartService.getCartByUser(user.getId());
            for (CartItem item : items) {
                if (item.getProduct().getId().equals(productId)) {
                    cartService.removeItem(item.getId());
                    break;
                }
            }
        } else {
            sessionCartService.removeItem(session, productId);
        }
        return "redirect:/cart";
    }

    @PostMapping("/clear")
    public String clearCart(Principal principal, HttpSession session) {
        if (principal != null) {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cartService.clearCart(user.getId());
        } else {
            sessionCartService.clearCart(session);
        }
        return "redirect:/cart";
    }

    /*
    @PostMapping("/checkout")
    public String processCheckout(@RequestParam("paymentMethod") String paymentMethod,
                                  Principal principal,
                                  HttpSession session,
                                  Model model) {

        List<CartItem> cartItems;
        User user = null;

        if (principal != null) {
            user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cartItems = cartService.getCartByUser(user.getId());
        } else {
            cartItems = sessionCartService.getCart(session);
        }

        if (cartItems.isEmpty()) {
            model.addAttribute("error", "Your cart is empty!");
            return "cart/checkout";
        }

        // Create order from cart
        Order order;
        if (user != null) {
            order = cartService.createOrderFromCart(user, cartItems);
        } else {
            order = sessionCartService.createOrderFromCart(cartItems);
        }

        // Save payment info
        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(PaymentType.valueOf(paymentMethod))
                .status(PaymentStatus.PENDING)
                .build();

        if (user != null) {
            cartService.savePayment(payment);
            cartService.clearCart(user.getId());
        } else {
            sessionCartService.savePayment(payment);
            sessionCartService.clearCart(session);
        }

        // Redirect based on payment method
        if (paymentMethod.equals("PAYPAL")) {
            // Show PayPal payment page
            model.addAttribute("orderId", order.getId());
            model.addAttribute("total", order.getTotalAmount());
            return "cart/paypal-checkout"; // New Thymeleaf template for PayPal payment
        } else if (paymentMethod.equals("COD")) {
            // Redirect to order confirmation for COD
            return "redirect:/order/confirmation";
        }

        // Default fallback
        return "redirect:/cart";
    }
     */

    @GetMapping("/checkout")
    public String checkout(Model model, Principal principal, HttpSession session) {
        List<CartItem> cartItems;

        if (principal != null) {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cartItems = cartService.getCartByUser(user.getId());
        } else {
            cartItems = sessionCartService.getCart(session);
        }

        BigDecimal total = cartService.calculateTotal(cartItems);

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("total", total);
        model.addAttribute("paymentMethods", List.of("PAYPAL", "COD"));  // Pass payment options
        return "cart/checkout";
    }

}
