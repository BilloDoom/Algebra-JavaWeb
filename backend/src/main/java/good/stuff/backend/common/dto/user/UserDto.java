package good.stuff.backend.common.dto.user;

import good.stuff.backend.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String profilePictureUrl;
    private Role role;
    private List<UserAddressDto> addresses;
}
