package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.RDV;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Enums.RDVStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface RDVRepository   extends JpaRepository<RDV, Long> {
    List<RDV> findByUser(User user);

    @Query("SELECT r FROM RDV r JOIN FETCH r.user")
    List<RDV> findAllWithUser();
    List<RDV> findByStatusAndRDVDateBefore(RDVStatus status, LocalDateTime dateTime);


}
