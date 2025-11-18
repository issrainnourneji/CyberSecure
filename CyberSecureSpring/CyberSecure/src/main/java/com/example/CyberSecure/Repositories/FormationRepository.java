package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    @Query("SELECT DISTINCT f.categorie FROM Formation f")
    List<String> findDistinctCategories();

    @Query("SELECT f FROM Formation f WHERE LOWER(f.categorie) = LOWER(:categorie)")
    List<Formation> findByCategorie(String categorie);
}
