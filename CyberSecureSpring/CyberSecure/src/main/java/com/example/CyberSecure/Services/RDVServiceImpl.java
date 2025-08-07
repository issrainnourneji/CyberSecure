package com.example.CyberSecure.Services;

import com.example.CyberSecure.Dto.RDVDto;
import com.example.CyberSecure.Entities.RDV;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Enums.RDVStatus;
import com.example.CyberSecure.Enums.RDVType;
import com.example.CyberSecure.Repositories.RDVRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class RDVServiceImpl {
    private final RDVRepository rdvRepository;
    private final UserRepository userRepository;
    private final EmailServiceImpl emailService;


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

    public List<RDV> getUserAppointments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return rdvRepository.findByUser(user);
    }

    public RDV updateRDV(Long id, Map<String, Object> request, String userEmail) {
        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        if (!rdv.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("Not authorized");
        }

        if (rdv.getStatus() != RDVStatus.PENDING) {
            throw new IllegalStateException("Cannot modify a confirmed RDV");
        }

        if (request.containsKey("RDVDate")) {
            LocalDateTime newDate = LocalDateTime.parse((String) request.get("RDVDate"));
            if (newDate.isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Date must be in the future");
            }
            rdv.setRDVDate(newDate);
        }

        if (request.containsKey("notes")) {
            rdv.setNotes(request.get("notes").toString());
        }

        if (request.containsKey("RDVType")) {
            rdv.setRDVType(RDVType.valueOf(request.get("RDVType").toString()));
        }

        return rdvRepository.save(rdv);
    }
    public void deleteRDV(Long id, String userEmail) {
        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        if (!rdv.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("Not authorized");
        }

        if (rdv.getStatus() != RDVStatus.PENDING) {
            throw new IllegalStateException("Cannot delete a confirmed RDV");
        }

        rdvRepository.delete(rdv);
    }

    public List<RDVDto> getAllRDVsWithUsers() {
        return rdvRepository.findAllWithUser()
                .stream()
                .map(RDVDto::new)
                .collect(Collectors.toList());
    }


    @Transactional
    public RDV confirmRDV(Long rdvId) {
        RDV rdv = rdvRepository.findById(rdvId)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        rdv.setStatus(RDVStatus.CONFIRMED);
        rdvRepository.save(rdv);

        // Envoi d’email après save pour éviter que ça bloque la transaction
        try {
            emailService.sendRDVEmail(
                    rdv.getUser().getEmail(),
                    "Confirmation de votre rendez-vous",
                    rdv.getUser().getName(),
                    rdv.getRDVDate().toString(),
                    "Merci de votre confiance. Veuillez être présent à l'heure indiquée."
            );
        } catch (Exception e) {
            // Important : ne jamais relancer ici !
            log.error("Erreur lors de l'envoi de l'e-mail de confirmation pour le RDV ID {}: {}", rdvId, e.getMessage());
        }

        return rdv;
    }

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void deleteExpiredPendingRDVs() {
        LocalDateTime now = LocalDateTime.now();
        List<RDV> expiredRDVs = rdvRepository.findByStatusAndRDVDateBefore(RDVStatus.PENDING, now);

        if (!expiredRDVs.isEmpty()) {
            rdvRepository.deleteAll(expiredRDVs);
            System.out.println("Supprimé " + expiredRDVs.size() + " RDVs expirés.");
        }
    }

}
