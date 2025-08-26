package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.CartItem;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.CartItemRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Services.CartServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceImpl cartService;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    @PostMapping("/add/{formationId}")
    public ResponseEntity<Map<String, Object>> addToCart(
            @PathVariable Long formationId,
            Authentication authentication) {

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        cartService.addToCart(user.getId(), formationId);

        return ResponseEntity.ok(Map.of("message", "Formation added to cart successfully!"));
    }


    @GetMapping("/me")
    public ResponseEntity<List<CartItem>> getMyCart(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Retrouver l’utilisateur dans la base
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartService.getUserCart(user.getId());
        return ResponseEntity.ok(cartItems);
    }

    // Supprimer un item
    @DeleteMapping("/remove/{formationId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long formationId,
            Authentication authentication) {

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        cartService.removeFromCart(user.getId(), formationId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/formation/{formationId}/students/count")
    public ResponseEntity<Long> getNumberOfStudents(@PathVariable Long formationId) {
        long count = cartItemRepository.countByFormationId(formationId);
        return ResponseEntity.ok(count);
    }

}