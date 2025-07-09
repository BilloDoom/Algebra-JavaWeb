package good.stuff.backend.common.dto.order;

import good.stuff.backend.common.enums.Payment.PaymentStatus;
import good.stuff.backend.common.enums.Payment.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private PaymentType method;
    private PaymentStatus status;
}
