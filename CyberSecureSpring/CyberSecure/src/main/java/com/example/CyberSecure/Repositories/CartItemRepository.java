package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndFormationId(Long userId, Long formationId);
    List<CartItem> findByFormationId(Long formationId);
    long countByFormationId(Long formationId);
    @Modifying
    @Query ("DELETE FROM CartItem c WHERE c.formation.id = :formationId")
    void deleteByFormationId(@Param("formationId") Long formationId);

    Optional<CartItem> findByFormationIdAndUserId(Long formationId, Long userId);

}