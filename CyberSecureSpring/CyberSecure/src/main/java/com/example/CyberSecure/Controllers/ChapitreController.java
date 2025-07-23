package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Services.ChapitreServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chapitre")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ChapitreController {

    private final ChapitreServiceImpl chapitreService;

    @PostMapping("/add/{formationId}")
    public ResponseEntity <Chapitre > addChapitre(
            @PathVariable  Long formationId,
            @RequestParam  String titre
    ) {
        Chapitre chapitre = chapitreService.addChapitreToFormation(formationId, titre);
        return ResponseEntity.ok(chapitre);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Chapitre> updateChapitre(
            @PathVariable Long id,
            @RequestParam String titre
    ) {
        Chapitre updated = chapitreService.updateChapitre(id, titre);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapitre(@PathVariable Long id) {
        try {
            chapitreService.deleteChapitre(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
