package good.stuff.backend.controller.user;

import good.stuff.backend.common.dto.user.UserAddressDto;
import good.stuff.backend.service.user.UserAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final UserAddressService addressService;

    @PostMapping
    public ResponseEntity<UserAddressDto> addAddress(
            @PathVariable Long userId,
            @RequestBody UserAddressDto request) {
        return ResponseEntity.ok(addressService.addAddress(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<UserAddressDto>> getUserAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddresses(userId));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}