package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Dto.RDVDto;
import com.example.CyberSecure.Entities.RDV;
import com.example.CyberSecure.Services.RDVServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
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
            RDV appointment = rdvService.createRDV(request, principal.getName());
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(Principal principal) {
        return ResponseEntity.ok(rdvService.getUserAppointments(principal.getName()));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRDV(@PathVariable Long id, @RequestBody Map<String, Object> request, Principal principal) {
        try {
            return ResponseEntity.ok(rdvService.updateRDV(id, request, principal.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRDV(@PathVariable Long id, Principal principal) {
        try {
            rdvService.deleteRDV(id, principal.getName());
            return ResponseEntity.ok().body(Map.of("message", "RDV deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<RDVDto>> getAllRDVs() {
        return ResponseEntity.ok(rdvService.getAllRDVsWithUsers());
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmRDV(@PathVariable Long id) {
        try {
            RDV confirmed = rdvService.confirmRDV(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Rendez-vous confirmé avec succès",
                    "rdv", confirmed
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Erreur lors de la confirmation : " + e.getMessage()));
        }
    }

}
