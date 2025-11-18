package com.example.CyberSecure.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "certification")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("certifications")
    private User user;

    @ManyToOne
    @JoinColumn(name = "formation_id")
    @JsonIgnoreProperties("certifications")
    private Formation formation;

    private LocalDateTime dateObtained = LocalDateTime.now();

    @Column(unique = true)
    private String certificateNumber;

    private String status = "VALID";

    private String userName;
    private String userAddress;
}
