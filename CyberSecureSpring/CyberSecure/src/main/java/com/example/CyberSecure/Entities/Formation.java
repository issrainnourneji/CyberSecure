package com.example.CyberSecure.Entities;

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
@Table(name="formation")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Formation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String imageUrl;
    private double price;
    private double duration;
    private String categorie;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @JsonManagedReference
    private List<Chapitre> chapitres;


    public Formation(String title, String description, String imageUrl, double price, double duration, String categorie) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.duration = duration;
        this.categorie = categorie;

    }

}
