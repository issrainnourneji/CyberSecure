package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Repositories.FormationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ChapitreServiceImpl {
    private final FormationRepository formationRepository;
    private final ChapitreRepository chapitreRepository;

    public Chapitre addChapitreToFormation(Long formationId, String titre, MultipartFile image) throws IOException {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            String fileName = image.getOriginalFilename();
            String path = "C:/Users/starinfo/Desktop/CyberSecure/CyberSecureSpring/CyberSecure/uploads/" + fileName;
            image.transferTo(new File(path));
            imageUrl = fileName;
        }

        Chapitre chapitre = Chapitre.builder()
                .titre(titre)
                .imageUrl(imageUrl)
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

    public List<Chapitre> getChapitresByFormation(Long formationId) {
        return chapitreRepository.findByFormationId(formationId);
    }

}