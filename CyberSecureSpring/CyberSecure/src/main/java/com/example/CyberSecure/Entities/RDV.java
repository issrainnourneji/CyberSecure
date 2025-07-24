package com.example.CyberSecure.Entities;

import com.example.CyberSecure.Enums.RDVStatus;
import com.example.CyberSecure.Enums.RDVType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "RDV")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RDV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    @Future(message = "The date must be in the future")
    private LocalDateTime RDVDate;

    @NotNull(message = "RDVType is required")
    @Enumerated(EnumType.STRING)
    private RDVType RDVType;

    @Column(length = 500)
    @NotNull(message = "Notes is required")
    private String notes;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private RDVStatus status = RDVStatus.PENDING;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
