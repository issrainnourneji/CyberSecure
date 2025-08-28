package com.example.CyberSecure.Repositories;

import com.example.CyberSecure.Entities.Slide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlideRepository extends JpaRepository<Slide, Long> {
    List<Slide> findByChapitreId(Long chapitreId);


}
