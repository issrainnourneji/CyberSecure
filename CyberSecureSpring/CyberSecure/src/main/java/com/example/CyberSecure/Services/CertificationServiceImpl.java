package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Certification;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.CertificationRepository;
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
        User user = userService.findById(userId);
        Formation formation = formationService.findById(formationId);
        Certification cert = new Certification();
        cert.setUser(user);
        cert.setFormation(formation);
        cert.setDateObtained(LocalDateTime.now());
        cert.setCertificateNumber(UUID.randomUUID().toString());
        cert.setStatus("VALID");

        cert.setUserName(user.getName());
        cert.setUserAddress(user.getAddress());

        return certificationRepository.save(cert);
    }

    private String generateCertificateNumber(User user, Formation formation) {
        return "CERT-" + user.getId() + "-" + formation.getId() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public Certification getCertificationById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
    }


    public List<Certification> getUserCertifications(User user) {
        return certificationRepository.findByUser(user);
    }

    public Long getTotalCertifications() {
        return certificationRepository.countAllCertifications();
    }
    public List<Certification> getCertificationsByUserId(Long userId) {
        return certificationRepository.findByUserId(userId);
    }

    public Certification updateCertification(Long id, Certification updatedCert) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));

        if (updatedCert.getUserName() != null) cert.setUserName(updatedCert.getUserName());
        if (updatedCert.getUserAddress() != null) cert.setUserAddress(updatedCert.getUserAddress());
        if (updatedCert.getStatus() != null) cert.setStatus(updatedCert.getStatus());

        // cert.setFormation(updatedCert.getFormation());
        // cert.setUser(updatedCert.getUser());

        return certificationRepository.save(cert);
    }

}