package com.example.CyberSecure.Repositories.Quiz;

import com.example.CyberSecure.Entities.Quiz.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByChapitreId(Long chapitreId);

    @Query("SELECT q FROM Quiz q JOIN FETCH q.questions qu JOIN FETCH qu.reponses WHERE q.chapitre.id = :chapitreId")
    Optional<Quiz> findQuizWithQuestionsAndReponsesByChapitre(@Param("chapitreId") Long chapitreId);

}