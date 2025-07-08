package good.stuff.backend.common.model.user;

import good.stuff.backend.common.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_addresses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAddress extends BaseEntity {
    private String street;

    private String city;

    private String state;

    private String zip;

    private String country;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public String formatAddress() {
        return String.format("%s, %s, %s, %s, %s",
                street,
                city,
                state,
                zip,
                country);
    }
}
