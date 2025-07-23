package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Repositories.FormationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ChapitreServiceImpl {
    private final FormationRepository formationRepository;
    private final ChapitreRepository chapitreRepository;

    public Chapitre addChapitreToFormation(Long formationId, String titre) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        Chapitre chapitre = Chapitre.builder()
                .titre(titre)
                .formation(formation)
                .build();

        return chapitreRepository.save(chapitre);
    }

    public Chapitre updateChapitre(Long id, String titre) {
        Chapitre chapitre = chapitreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chapitre not found"));
        chapitre.setTitre(titre);
        return chapitreRepository.save(chapitre);
    }
    public void deleteChapitre(Long id) {
        chapitreRepository.deleteById(id);
    }
}