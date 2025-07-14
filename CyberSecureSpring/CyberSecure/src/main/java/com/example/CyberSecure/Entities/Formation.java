package com.example.CyberSecure.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private int numberOfStudents;


    public Formation(String title, String description, String imageUrl, double price, double duration, int numberOfStudents) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.duration = duration;
        this.numberOfStudents = numberOfStudents;

    }

}
