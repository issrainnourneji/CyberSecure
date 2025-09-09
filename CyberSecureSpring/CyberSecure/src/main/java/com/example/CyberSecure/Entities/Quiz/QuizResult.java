package com.example.CyberSecure.Entities.Quiz;

import com.example.CyberSecure.Entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Entity
@Table(name = "quiz_result")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score; // en %
    private boolean success;

    // ⚡ important : initialise toujours la Map
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "quiz_result_answers",
            joinColumns = @JoinColumn(name = "quiz_result_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer_id")
    private Map<Long, Long> userAnswers = new HashMap<>();

    private LocalDateTime datePassed = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
