package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Certification;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.CertificationRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Services.CertificationServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;



import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/certificat")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationServiceImpl certificationService;
    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;

    @PostMapping("/generate")
    public Certification generateCertification(@RequestParam Long userId, @RequestParam Long formationId) {
        return certificationService.generateCertification(userId, formationId);
    }

    @GetMapping("/{id}")
    public Certification getCertification(@PathVariable Long id) {
        return certificationService.getCertificationById(id);
    }

    @GetMapping("/mycertifs")
    public ResponseEntity<List<Certification>> getMyCertifications(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Certification> certifications = certificationService.getUserCertifications(user);
        return ResponseEntity.ok(certifications);
    }
    @GetMapping("/count")
    public Long getTotalCertifications() {
        return certificationService.getTotalCertifications();
    }
    @GetMapping("/all")
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    @GetMapping("/user/{id}")
    public List<Certification> getCertificationsByUser(@PathVariable Long id) {
        return certificationService.getCertificationsByUserId(id);
    }

    @GetMapping("/user/{userId}/formation/{formationId}")
    public List<Certification> getCertificationsByUserAndFormation(
            @PathVariable Long userId,
            @PathVariable Long formationId) {
        return certificationRepository.findByUserIdAndFormationId(userId, formationId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Certification> updateCertification(
            @PathVariable Long id,
            @RequestBody Certification updatedCert) {
        try {
            Certification cert = certificationService.updateCertification(id, updatedCert);
            return ResponseEntity.ok(cert);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        Certification cert = certificationService.getCertificationById(id);
        certificationRepository.delete(cert);
        return ResponseEntity.noContent().build();
    }

}