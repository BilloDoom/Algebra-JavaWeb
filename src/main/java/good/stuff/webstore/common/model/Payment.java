package good.stuff.webstore.common.model;

import good.stuff.webstore.common.enums.Payment.PaymentStatus;
import good.stuff.webstore.common.enums.Payment.PaymentType;
import good.stuff.webstore.common.model.order.Order;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false)
    private BigDecimal amount;

    private String transactionId;

    private String payerEmail;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
