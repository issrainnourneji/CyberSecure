package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Certification;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.CertificationRepository;
import com.example.CyberSecure.Repositories.FormationRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificationServiceImpl{

    private final CertificationRepository certificationRepository;
    private final UserServiceImpl userService;
    private final FormationServiceImpl formationService;

    public Certification generateCertification(Long userId, Long formationId) {
        List<Certification> existing = certificationRepository.findByUserAndFormation(userId, formationId);

        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        Certification cert = new Certification();
        cert.setUser(userService.findById(userId));
        cert.setFormation(formationService.findById(formationId));
        cert.setDateObtained(LocalDateTime.now());
        cert.setCertificateNumber(UUID.randomUUID().toString());
        cert.setStatus("VALID");

        return certificationRepository.save(cert);
    }

    private String generateCertificateNumber(User user, Formation formation) {
        // Exemple : CERT-UserId-FormationId-UUID
        return "CERT-" + user.getId() + "-" + formation.getId() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public Certification getCertificationById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
    }


    public List<Certification> getUserCertifications(User user) {
        return certificationRepository.findByUser(user);
    }
}