package good.stuff.webstore.controller.rest;

import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.common.model.user.UserAddress;
import good.stuff.webstore.service.user.UserAddressService;
import good.stuff.webstore.service.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserAddressRestController {

    private final UserAddressService userAddressService;
    private final UserService userService;

    public UserAddressRestController(UserAddressService userAddressService, UserService userService) {
        this.userAddressService = userAddressService;
        this.userService = userService;
    }

    // in controller method:
    @GetMapping("/address/{id}")
    public ResponseEntity<UserAddress> getAddress(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserDetails userDetails) {

        // Load full user entity from DB by username:
        User user = userService.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userAddressService.findById(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/address")
    public ResponseEntity<?> addAddress(@RequestBody UserAddress address, @AuthenticationPrincipal User user) {
        try {
            UserAddress saved = userAddressService.addAddress(user, address);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add address");
        }
    }

    @PutMapping("/address/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id,
                                           @RequestBody UserAddress updatedAddress,
                                           @AuthenticationPrincipal User user) {
        try {
            UserAddress updated = userAddressService.updateAddress(user, id, updatedAddress);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update address");
        }
    }

    @DeleteMapping("/address/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            userAddressService.deleteAddress(user, id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete address");
        }
    }
}


