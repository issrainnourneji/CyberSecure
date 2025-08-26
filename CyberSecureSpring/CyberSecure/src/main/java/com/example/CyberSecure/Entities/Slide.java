package com.example.CyberSecure.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "slide")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String titre;
    private String sousTitre;
    @Column(length = 2000)
    private String paragraphe;
    private String imageUrl;
    private String videoUrl;

    private String imageWidth;     // ex: 50%, 300px
    private String imageHeight;    // ex: auto, 200px
    private String imagePosition;
    private String imagePositionY;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chapitre_id")
    private Chapitre chapitre;
}
