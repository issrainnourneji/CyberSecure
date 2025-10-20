package com.example.CyberSecure.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "slidehtml")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slidehtml {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(columnDefinition = "TEXT")
    private String htmlContent;
    
}
