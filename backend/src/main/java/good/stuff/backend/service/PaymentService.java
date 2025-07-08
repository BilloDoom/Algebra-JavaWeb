package good.stuff.backend.service;

import good.stuff.backend.common.enums.Payment.PaymentStatus;
import good.stuff.backend.common.enums.Payment.PaymentType;
import good.stuff.backend.common.model.order.Order;
import good.stuff.backend.common.model.order.Payment;
import good.stuff.backend.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Payment createPayment(Order order, PaymentType paymentType) {
        Payment payment = Payment.builder()
                .order(order)
                .method(paymentType)
                .status(PaymentStatus.PENDING)
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment createPaymentWithStatus(Order order, PaymentType paymentType, PaymentStatus status) {
        Payment payment = Payment.builder()
                .order(order)
                .method(paymentType)
                .status(status)
                .build();

        return paymentRepository.save(payment);
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId).orElse(null);
    }
}
