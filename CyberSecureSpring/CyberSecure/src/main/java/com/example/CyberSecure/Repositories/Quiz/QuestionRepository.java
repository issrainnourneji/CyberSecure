package com.example.CyberSecure.Repositories.Quiz;

import com.example.CyberSecure.Entities.Quiz.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {}
