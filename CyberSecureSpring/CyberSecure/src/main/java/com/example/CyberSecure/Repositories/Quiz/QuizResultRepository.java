package com.example.CyberSecure.Repositories.Quiz;

import com.example.CyberSecure.Entities.Quiz.Quiz;
import com.example.CyberSecure.Entities.Quiz.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    Optional<QuizResult> findByQuizIdAndUserIdAndSuccessTrue(Long quizId, Long userId);
    List<QuizResult> findByUserId(Long userId);
    List<QuizResult> findByUserIdAndQuiz_Chapitre_Id(Long userId, Long chapitreId);
    @Query("SELECT qr.quiz.chapitre.id FROM QuizResult qr " +
            "WHERE qr.user.id = :userId AND qr.success = true")
    List<Long> findPassedChapitresByUserId(@Param("userId") Long userId);
    List<QuizResult> findByUserIdAndQuizId(Long userId, Long quizId);

    Optional<QuizResult> findTopByUserIdAndQuizIdOrderByDatePassedDesc(Long userId, Long quizId);
    Optional<QuizResult> findTopByUserIdAndQuiz_ChapitreIdOrderByDatePassedDesc(Long userId, Long chapitreId);
    List<QuizResult> findByQuizId(Long quizId);
}