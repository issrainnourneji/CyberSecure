package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Quiz.Question;
import com.example.CyberSecure.Entities.Quiz.Quiz;
import com.example.CyberSecure.Entities.Quiz.QuizResult;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.Quiz.QuestionRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Services.QuizServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {


        private final QuizServiceImpl quizService;
        private final QuizRepository quizRepository;
        private final QuestionRepository questionRepository;
        private final UserRepository userRepository;

        @PostMapping("/add/{chapitreId}")
        public ResponseEntity<Quiz> addQuiz(@PathVariable Long chapitreId,
                                            @RequestParam String titre,
                                            @RequestParam int timeLimit) {
            return ResponseEntity.ok(quizService.addQuizToChapitre(chapitreId, titre, timeLimit));
        }

        @GetMapping("/chapitre/{chapitreId}")
        public ResponseEntity<Quiz> getQuizByChapitre(@PathVariable Long chapitreId) {
            return ResponseEntity.ok(quizService.getQuizByChapitre(chapitreId));
        }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizResult> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Long, Long> userAnswers,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            throw new RuntimeException("Utilisateur non authentifié");
        }

        // Récupérer l’utilisateur connecté
        String username = userDetails.getUsername();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Vérifier si l’utilisateur a déjà un résultat
        Optional<QuizResult> existing = quizService.getUserQuizResult(quizId, user.getId());
        if (existing.isPresent()) {
            QuizResult res = existing.get();
            // ⚡ S’il a déjà réussi, on bloque la répétition
            if (res.isSuccess()) {
                return ResponseEntity.ok(res);
            }
        }

        // Corriger et enregistrer le nouveau résultat
        QuizResult newResult = quizService.submitQuiz(quizId, user.getId(), userAnswers);

        // ⚡ Si le quiz est réussi, on garde ce résultat comme définitif
        if (newResult.isSuccess()) {
            return ResponseEntity.ok(newResult);
        }

        // S’il a échoué → il peut réessayer
        return ResponseEntity.ok(newResult);
    }




    @PostMapping(value = "/{quizId}/addQ", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Question> addQuestion(
            @PathVariable Long quizId,
            @RequestBody Question question) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz introuvable"));

        question.setQuiz(quiz);

        if (question.getReponses() != null) {
            question.getReponses().forEach(r -> r.setQuestion(question));
        }

        Question saved = questionRepository.save(question);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/chapitre/{chapitreId}/result")
    public ResponseEntity<QuizResult> getUserResult(
            @PathVariable Long chapitreId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Optional<Quiz> quiz = quizRepository.findByChapitreId(chapitreId);
        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<QuizResult> result = quizService.getUserQuizResult(quiz.get().getId(), user.getId());
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }
    @GetMapping("/user/history")
    public ResponseEntity<List<QuizResult>> getUserQuizHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<QuizResult> results = quizService.getUserQuizResults(user.getId());

        return ResponseEntity.ok(results);
    }

    @GetMapping("/all")
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // 🔹 Récupérer un quiz spécifique avec ses détails
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

}
