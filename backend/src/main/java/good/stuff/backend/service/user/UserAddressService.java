package good.stuff.backend.service.user;

import good.stuff.backend.common.dto.user.UserAddressDto;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.common.model.user.UserAddress;
import good.stuff.backend.repository.user.UserAddressRepository;
import good.stuff.backend.repository.user.UserRepository;
import good.stuff.backend.utils.MapperUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserAddressService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;

    public UserAddressDto addAddress(Long userId, UserAddressDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getAddresses().size() >= 4) {
            throw new IllegalStateException("Maximum of 4 addresses allowed.");
        }

        UserAddress address = MapperUtils.map(request, UserAddress.class);
        address.setUser(user);

        return MapperUtils.map(addressRepository.save(address), UserAddressDto.class);
    }

    public List<UserAddressDto> getAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return user.getAddresses().stream()
                .map(address -> MapperUtils.map(address, UserAddressDto.class))
                .collect(Collectors.toList());
    }

    public void deleteAddress(Long userId, Long addressId) {
        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (address.getUser().getId() != userId) {
            throw new SecurityException("Unauthorized deletion attempt.");
        }

        addressRepository.delete(address);
    }
}
