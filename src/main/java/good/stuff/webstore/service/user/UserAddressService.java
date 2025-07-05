package good.stuff.webstore.service.user;

import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.common.model.user.UserAddress;
import good.stuff.webstore.repository.user.UserAddressRepository;
import good.stuff.webstore.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserAddressService {

    private final UserAddressRepository userAddressRepository;

    public UserAddressService(UserAddressRepository userAddressRepository) {
        this.userAddressRepository = userAddressRepository;
    }

    public List<UserAddress> getAddressesByUser(User user) {
        return userAddressRepository.findByUser(user);
    }

    public UserAddress addAddress(User user, UserAddress address) {
        List<UserAddress> existingAddresses = getAddressesByUser(user);
        if (existingAddresses.size() >= 4) {
            throw new IllegalStateException("User cannot have more than 4 addresses.");
        }
        address.setUser(user);
        return userAddressRepository.save(address);
    }

    public UserAddress updateAddress(User user, Long addressId, UserAddress updatedAddress) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You can only edit your own addresses.");
        }

        address.setStreet(updatedAddress.getStreet());
        address.setCity(updatedAddress.getCity());
        address.setState(updatedAddress.getState());
        address.setZip(updatedAddress.getZip());
        address.setCountry(updatedAddress.getCountry());

        return userAddressRepository.save(address);
    }

    public void deleteAddress(User user, Long addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You can only delete your own addresses.");
        }

        userAddressRepository.delete(address);
    }

    public Optional<UserAddress> getAddressByIdAndUser(Long addressId, User user) {
        return userAddressRepository.findByIdAndUser(addressId, user);
    }

    public Optional<UserAddress> findById(Long id, User user) {
        return userAddressRepository.findByIdAndUser(id, user);
    }
}
