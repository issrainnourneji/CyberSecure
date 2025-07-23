package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Entities.Slide;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Repositories.SlideRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@AllArgsConstructor
public class SlideServiceImpl {
    private final ChapitreRepository chapitreRepository;
    private final SlideRepository slideRepository;

    public Slide addSlideToChapitre(Long chapitreId, String titre, String sousTitre,
                                    String paragraphe, MultipartFile image, String videoUrl) throws IOException {

        Chapitre chapitre = chapitreRepository.findById(chapitreId)
                .orElseThrow(() -> new RuntimeException("Chapitre not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            String fileName = image.getOriginalFilename();
            String path = "C:/Users/starinfo/Desktop/CyberSecure/CyberSecureSpring/CyberSecure/uploads/" + fileName;
            image.transferTo(new File(path));
            imageUrl = fileName;
        }

        Slide slide = Slide.builder()
                .titre(titre)
                .sousTitre(sousTitre)
                .paragraphe(paragraphe)
                .imageUrl(imageUrl)
                .videoUrl(videoUrl)
                .chapitre(chapitre)
                .build();

        return slideRepository.save(slide);
    }
}