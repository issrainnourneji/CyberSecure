package com.example.CyberSecure.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name = "chapitre")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapitre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @ManyToOne
    @JoinColumn(name = "formation_id")
    @JsonBackReference
    private Formation formation;

    @OneToMany(mappedBy = "chapitre", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @JsonManagedReference
    private List<Slide> slides;
}
