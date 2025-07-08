package good.stuff.backend.common.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAddressDto {
    private Long id;
    private String street;
    private String city;
    private String state;
    private String zip;
    private String country;
}
