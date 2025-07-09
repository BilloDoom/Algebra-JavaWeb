package good.stuff.backend.common.dto.order;

import good.stuff.backend.common.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private Long userId;
    private List<OrderItemDTO> items;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private PaymentDTO payment;
}
