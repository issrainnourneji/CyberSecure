package com.example.CyberSecure.Dto;

import com.example.CyberSecure.Entities.RDV;
import com.example.CyberSecure.Enums.RDVStatus;
import com.example.CyberSecure.Enums.RDVType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class RDVDto {
    private Long id;
    private String notes;
    private RDVStatus status;
    private LocalDateTime RDVDate;
    private RDVType RDVType;
    private String userName;
    private String userEmail;

    public RDVDto(RDV rdv) {
        this.id = rdv.getId();
        this.notes = rdv.getNotes();
        this.status = rdv.getStatus();
        this.RDVDate = rdv.getRDVDate();
        this.RDVType = rdv.getRDVType();
        this.userName = rdv.getUser().getName();
        this.userEmail = rdv.getUser().getEmail();

    }
}
