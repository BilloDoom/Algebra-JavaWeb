package good.stuff.backend.common.request;

public record CartItemRequest(
        Long productId,
        int quantity) {
}