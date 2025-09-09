package com.example.CyberSecure.Entities.Quiz;

import com.example.CyberSecure.Entities.Chapitre;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name = "quiz")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private int timeLimit; // en secondes (par ex: 60 sec)

    @OneToOne
    @JoinColumn(name = "chapitre_id")
    @JsonManagedReference   // <- Ignore Chapitre lors de la sérialisation Quiz
    private Chapitre chapitre;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference   // <- Ignore Question lors de la sérialisation Quiz pour éviter boucle
    private List<Question> questions;
}
