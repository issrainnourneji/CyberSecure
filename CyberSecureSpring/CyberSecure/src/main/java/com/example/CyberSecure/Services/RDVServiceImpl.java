package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.RDV;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Enums.RDVStatus;
import com.example.CyberSecure.Enums.RDVType;
import com.example.CyberSecure.Repositories.RDVRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;

@Service
@AllArgsConstructor
public class RDVServiceImpl {
    private final RDVRepository rdvRepository;
    private final UserRepository userRepository;

    public RDV createRDV(Map<String, Object> request, String clientEmail) {
        // Récupérer le client via son email
        User user = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // Extraire et valider les détails de la requête
        String rdvDateStr = (String) request.get("RDVDate");
        String rdvTypeStr = (String) request.get("RDVType");
        String notes = request.getOrDefault("notes", "").toString();

        if (rdvDateStr == null || rdvTypeStr == null) {
            throw new IllegalArgumentException("Date and type are required");
        }

        LocalDateTime RDVDate;
        try {
            RDVDate = LocalDateTime.parse(rdvDateStr);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO-8601 format");
        }

        // Créer et sauvegarder le rendez-vous
        RDV appointment = RDV.builder()
                .user(user)
                .RDVDate(RDVDate)
                .RDVType(RDVType.valueOf(rdvTypeStr.toUpperCase()))
                .notes(notes)
                .status(RDVStatus.PENDING)
                .build();

        return rdvRepository.save(appointment);
    }
}
