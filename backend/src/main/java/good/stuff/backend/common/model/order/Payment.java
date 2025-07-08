package good.stuff.backend.common.model.order;

import good.stuff.backend.common.enums.Payment.PaymentStatus;
import good.stuff.backend.common.enums.Payment.PaymentType;
import good.stuff.backend.common.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
