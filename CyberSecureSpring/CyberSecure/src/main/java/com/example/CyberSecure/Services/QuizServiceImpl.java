package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Entities.Quiz.Question;
import com.example.CyberSecure.Entities.Quiz.Quiz;
import com.example.CyberSecure.Entities.Quiz.QuizResult;
import com.example.CyberSecure.Entities.Quiz.Reponse;
import com.example.CyberSecure.Entities.Slide;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Repositories.Quiz.QuestionRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizResultRepository;
import com.example.CyberSecure.Repositories.Quiz.ReponseRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl {

    private final QuizRepository quizRepository;
    private final ChapitreRepository chapitreRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    public Quiz addQuizToChapitre(Long chapitreId, String titre, int timeLimit) {
        Chapitre chapitre = chapitreRepository.findById(chapitreId)
                .orElseThrow(() -> new RuntimeException("Chapitre introuvable"));

        Quiz quiz = Quiz.builder()
                .titre(titre)
                .timeLimit(timeLimit)
                .chapitre(chapitre)
                .build();

        return quizRepository.save(quiz);
    }

    public Quiz getQuizByChapitre(Long chapitreId) {
        return quizRepository.findByChapitreId(chapitreId)
                .orElseThrow(() -> new RuntimeException("Quiz introuvable pour ce chapitre"));
    }

    public QuizResult submitQuiz(Long quizId, Long userId, Map<Long, Long> userAnswersMap) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz introuvable"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        int totalQuestions = quiz.getQuestions().size();
        int correctAnswers = 0;

        for (Question question : quiz.getQuestions()) {
            Long chosenAnswerId = userAnswersMap.get(question.getId());
            if (chosenAnswerId != null) {
                boolean isCorrect = question.getReponses().stream()
                        .anyMatch(r -> r.getId().equals(chosenAnswerId) && r.isCorrect());
                if (isCorrect) correctAnswers++;
            }
        }

        int score = (int) (((double) correctAnswers / totalQuestions) * 100);
        boolean success = score >= 60;

        // ⚡ solution clé : assigner la Map après avoir créé l’objet
        QuizResult result = new QuizResult();
        result.setQuiz(quiz);
        result.setUser(user);
        result.setScore(score);
        result.setSuccess(success);
        result.setUserAnswers(new HashMap<>(userAnswersMap));
        result.setDatePassed(LocalDateTime.now());
        return quizResultRepository.save(result);
    }



    public Optional<QuizResult> getUserQuizResult(Long quizId, Long userId) {
        return quizResultRepository.findByQuizIdAndUserIdAndSuccessTrue(quizId, userId);
    }

    public List<QuizResult> getUserQuizResults(Long userId) {
        return quizResultRepository.findByUserId(userId);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz introuvable avec l'id : " + id));
    }

}
