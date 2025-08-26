package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Services.ChapitreServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/chapitre")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ChapitreController {

    private final ChapitreServiceImpl chapitreService;
    private final ChapitreRepository chapitreRepository;

    @PostMapping(value = "/add/{formationId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Chapitre> addChapitre(
            @PathVariable Long formationId,
            @RequestParam("titre") String titre,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        Chapitre chapitre = chapitreService.addChapitreToFormation(formationId, titre, image);
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

    @GetMapping("/{id}")
    public Chapitre getChapitreById(@PathVariable Long id) {
        return chapitreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chapitre non trouvé"));
    }

    @GetMapping("/formation/{formationId}")
    public List<Chapitre> getChapitresByFormation(@PathVariable Long formationId) {
        return chapitreService.getChapitresByFormation(formationId);
    }
}
