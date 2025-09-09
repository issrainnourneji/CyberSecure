package com.example.CyberSecure.Repositories.Quiz;

import com.example.CyberSecure.Entities.Quiz.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    Optional<QuizResult> findByQuizIdAndUserIdAndSuccessTrue(Long quizId, Long userId);
    List<QuizResult> findByUserId(Long userId);

}