package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndFormationId(Long userId, Long formationId);
    List<CartItem> findByFormationId(Long formationId);
    long countByFormationId(Long formationId);

}