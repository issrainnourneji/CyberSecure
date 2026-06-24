package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Dto.QuestionDTO;
import com.example.CyberSecure.Dto.QuizDTO;
import com.example.CyberSecure.Dto.ReponseDTO;
import com.example.CyberSecure.Entities.Quiz.Question;
import com.example.CyberSecure.Entities.Quiz.Quiz;
import com.example.CyberSecure.Entities.Quiz.QuizResult;
import com.example.CyberSecure.Entities.Quiz.Reponse;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.Quiz.QuestionRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizResultRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Services.QuizServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
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
        private final QuizResultRepository quizResultRepository;

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

        String username = userDetails.getUsername();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Optional<QuizResult> existing = quizService.getUserQuizResult(quizId, user.getId());
        if (existing.isPresent()) {
            QuizResult res = existing.get();
            if (res.isSuccess()) {
                return ResponseEntity.ok(res);
            }
        }

        QuizResult newResult = quizService.submitQuiz(quizId, user.getId(), userAnswers);

        if (newResult.isSuccess()) {
            return ResponseEntity.ok(newResult);
        }

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
    @GetMapping("/user/history/{chapitreId}")
    public ResponseEntity<List<QuizResult>> getUserQuizHistoryByChapitre(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long chapitreId) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<QuizResult> results = quizService.getUserQuizResultsByChapitre(user.getId(), chapitreId);

        return ResponseEntity.ok(results);
    }


    @GetMapping("/all")
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @GetMapping("/user/passed-chapitres")
    public ResponseEntity<List<Long>> getPassedChapitres(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return ResponseEntity.ok(quizService.getPassedChapitres(user.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<QuizResult>> getUserQuizzes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<QuizResult> results = quizService.getAllQuizzesOfUser(user.getId());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/user/{quizId}/history")
    public ResponseEntity<List<QuizResult>> getUserQuizHistoryByQuiz(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<QuizResult> results = quizResultRepository.findByUserIdAndQuizId(user.getId(), quizId);
        return ResponseEntity.ok(results);
    }
    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long id, @RequestBody QuizDTO quizDTO) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz introuvable"));

        quiz.setTitre(quizDTO.getTitre());
        quiz.setTimeLimit(quizDTO.getTimeLimit());

        synchronizeQuestions(quiz, quizDTO.getQuestions());

        Quiz updatedQuiz = quizRepository.save(quiz);
        return ResponseEntity.ok(mapToDTO(updatedQuiz));
    }

    private void synchronizeQuestions(Quiz quiz, List<QuestionDTO> questionDTOs) {
        quiz.getQuestions().removeIf(q -> questionDTOs.stream()
                .noneMatch(d -> d.getId() != null && d.getId().equals(q.getId())));

        for (QuestionDTO qDTO : questionDTOs) {
            Question question;
            if (qDTO.getId() != null) {
                question = quiz.getQuestions().stream()
                        .filter(q -> q.getId().equals(qDTO.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Question introuvable"));
                question.setTexte(qDTO.getTexte());
                synchronizeReponses(question, qDTO.getReponses());
            } else {
                question = new Question();
                question.setTexte(qDTO.getTexte());
                question.setQuiz(quiz);
                question.setReponses(new ArrayList<>());
                synchronizeReponses(question, qDTO.getReponses());
                quiz.getQuestions().add(question);
            }
        }
    }

    private void synchronizeReponses(Question question, List<ReponseDTO> reponseDTOs) {
        question.getReponses().removeIf(r -> reponseDTOs.stream()
                .noneMatch(d -> d.getId() != null && d.getId().equals(r.getId())));

        for (ReponseDTO rDTO : reponseDTOs) {
            Reponse reponse;
            if (rDTO.getId() != null) {
                reponse = question.getReponses().stream()
                        .filter(r -> r.getId().equals(rDTO.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Réponse introuvable"));
                reponse.setTexte(rDTO.getTexte());
                reponse.setCorrect(rDTO.isCorrect());
            } else {
                reponse = new Reponse();
                reponse.setTexte(rDTO.getTexte());
                reponse.setCorrect(rDTO.isCorrect());
                reponse.setQuestion(question);
                question.getReponses().add(reponse);
            }
        }
    }


    private QuizDTO mapToDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitre(quiz.getTitre());
        dto.setTimeLimit(quiz.getTimeLimit());

        List<QuestionDTO> questionDTOs = new ArrayList<>();
        if (quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                QuestionDTO qDTO = new QuestionDTO();
                qDTO.setId(q.getId());
                qDTO.setTexte(q.getTexte());

                List<ReponseDTO> reponseDTOs = new ArrayList<>();
                if (q.getReponses() != null) {
                    for (Reponse r : q.getReponses()) {
                        ReponseDTO rDTO = new ReponseDTO();
                        rDTO.setId(r.getId());
                        rDTO.setTexte(r.getTexte());
                        rDTO.setCorrect(r.isCorrect());
                        reponseDTOs.add(rDTO);
                    }
                }
                qDTO.setReponses(reponseDTOs);
                questionDTOs.add(qDTO);
            }
        }
        dto.setQuestions(questionDTOs);

        return dto;
    }
    
}
