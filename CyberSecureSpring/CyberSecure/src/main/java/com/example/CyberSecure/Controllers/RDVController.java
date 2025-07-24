package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.RDV;
import com.example.CyberSecure.Services.RDVServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/rdv")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class RDVController {
    private final RDVServiceImpl rdvService;

    @PostMapping("/add")
    public ResponseEntity<?> addAppointment(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            // Appel du service pour créer le rendez-vous
            RDV appointment = rdvService.createRDV(request, principal.getName());
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            // Gestion des erreurs personnalisées
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}
