package com.example.CyberSecure.Entities;


import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Table(name = "contact")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {
    private String name;
    private String email;
    private String subject;
    private String message;
}
