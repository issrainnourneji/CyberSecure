package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.Certification;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByUser(User user);

    @Query("SELECT c FROM Certification c WHERE c.user.id = :userId AND c.formation.id = :formationId")
    List<Certification> findByUserAndFormation(@Param("userId") Long userId, @Param("formationId") Long formationId);
    List<Certification> findByFormation(Formation formation);
    @Query("SELECT COUNT(c) FROM Certification c")
    Long countAllCertifications();

    List<Certification> findByUserId(Long userId);

    List<Certification> findByUserIdAndFormationId(Long userId, Long formationId);

}