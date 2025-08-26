package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.CartItem;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.CartItemRepository;
import com.example.CyberSecure.Repositories.FormationRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final FormationRepository formationRepository;

    public CartItem addToCart(Long userId, Long formationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        // Vérifier si déjà ajouté
        cartItemRepository.findByUserIdAndFormationId(userId, formationId)
                .ifPresent(item -> { throw new RuntimeException("Formation déjà dans le panier"); });

        CartItem cartItem = CartItem.builder()
                .user(user)
                .formation(formation)
                .build();

        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getUserCart(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public void removeFromCart(Long userId, Long formationId) {
        cartItemRepository.findByUserIdAndFormationId(userId, formationId)
                .ifPresent(cartItemRepository::delete);
    }

    public void clearCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(items);
    }
}

