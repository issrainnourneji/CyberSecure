package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByResetPasswordToken(String token);
    List<User> findByRole(UserRole role);
    List<User> findAllByRole(UserRole role);
    long countUsersByRole(UserRole role);

}
