package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.Slide;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Repositories.SlideRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class SlideServiceImpl {

    private static final String uploadDir = "C:/Users/starinfo/Desktop/CyberSecure/CyberSecureSpring/CyberSecure/uploads/";

    private final ChapitreRepository chapitreRepository;
    private final SlideRepository slideRepository;

    public List<Slide> getSlidesByChapitre(Long chapitreId) {
        return slideRepository.findByChapitreId(chapitreId);
    }

    public Slide addSlideToChapitre(Long chapitreId, String titre, String sousTitre,
                                    String paragraphe, MultipartFile image, String videoUrl,
                                    String imageWidth,String imageHeight,String imagePosition, String imagePositionY) throws IOException {

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
                .imageWidth(imageWidth != null ? imageWidth : "100%")       // valeur par défaut
                .imageHeight(imageHeight != null ? imageHeight : "auto")    // valeur par défaut
                .imagePosition(imagePosition != null ? imagePosition : "center")
                .imagePositionY(imagePositionY != null ? imagePositionY : "bottom")
                .chapitre(chapitre)
                .build();

        return slideRepository.save(slide);
    }

    public List<Slide> getAllSlides() {
        return slideRepository.findAll();
    }

    public Slide updateSlide(Long id, String titre, String sousTitre, String paragraphe, String videoUrl,
                             String imageWidth, String imageHeight, String imagePosition, String imagePositionY,
                             MultipartFile image, Boolean removeImage) throws IOException {

        Slide slide = slideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slide non trouvé"));

        if (titre != null) slide.setTitre(titre);
        if (sousTitre != null) slide.setSousTitre(sousTitre);
        if (paragraphe != null) slide.setParagraphe(paragraphe);
        if (videoUrl != null) slide.setVideoUrl(videoUrl);
        if (imageWidth != null) slide.setImageWidth(imageWidth);
        if (imageHeight != null) slide.setImageHeight(imageHeight);
        if (imagePosition != null) slide.setImagePosition(imagePosition);
        if (imagePositionY != null) slide.setImagePositionY(imagePositionY);

        if (image != null && !image.isEmpty()) {
            String imageFileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            String imagePath = uploadDir + imageFileName;
            image.transferTo(new File(imagePath));
            slide.setImageUrl(imageFileName);
        }
        else if (Boolean.TRUE.equals(removeImage)) {
            if (slide.getImageUrl() != null) {
                File oldFile = new File(uploadDir + slide.getImageUrl());
                if (oldFile.exists()) oldFile.delete();
            }
            slide.setImageUrl(null);
        }

        return slideRepository.save(slide);
    }


    public void deleteSlide(Long id) {
        Slide slide = slideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slide non trouvé"));
        slideRepository.delete(slide);
    }
}