package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.Chapitre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {
    List<Chapitre> findByFormationId(Long formationId);
    Chapitre findById(long id);
}
