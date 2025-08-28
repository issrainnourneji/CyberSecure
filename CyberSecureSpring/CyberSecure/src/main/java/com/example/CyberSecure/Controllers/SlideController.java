package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.Slide;
import com.example.CyberSecure.Services.SlideServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("/slide")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class SlideController {

    private final SlideServiceImpl  slideService;


    @GetMapping("/{chapitreId}")
    public List<Slide> getSlides(@PathVariable Long chapitreId) {
        return slideService.getSlidesByChapitre(chapitreId);
    }

    @PostMapping ("/add/{chapitreId}")
    public ResponseEntity <Slide > addSlide(
            @PathVariable  Long chapitreId,
            @RequestParam(required = false) String titre,
            @RequestParam(required = false) String sousTitre,
            @RequestParam(required = false) String paragraphe,
            @RequestParam(required = false) MultipartFile  image,
            @RequestParam(required = false) String videoUrl,
            @RequestParam(required = false) String imageWidth,
            @RequestParam(required = false) String imageHeight,
            @RequestParam(required = false) String imagePosition,
            @RequestParam(required = false) String imagePositionY




    ) throws IOException  {
        Slide slide = slideService.addSlideToChapitre(
                chapitreId,
                titre,
                sousTitre,
                paragraphe,
                image,
                videoUrl,
                imageWidth,
                imageHeight,
                imagePosition,
                imagePositionY
        );
        return ResponseEntity.ok(slide);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Slide>> getAllSlides() {
        return ResponseEntity.ok(slideService.getAllSlides());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Slide> updateSlide(
            @PathVariable Long id,
            @RequestParam(required = false) String titre,
            @RequestParam(required = false) String sousTitre,
            @RequestParam(required = false) String paragraphe,
            @RequestParam(required = false) String videoUrl,
            @RequestParam(required = false) String imageWidth,
            @RequestParam(required = false) String imageHeight,
            @RequestParam(required = false) String imagePosition,
            @RequestParam(required = false) String imagePositionY,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        Slide updatedSlide = slideService.updateSlide(id, titre, sousTitre, paragraphe, videoUrl,
                imageWidth, imageHeight, imagePosition, imagePositionY, image);

        return ResponseEntity.ok(updatedSlide);
    }

    // --- DELETE SLIDE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSlide(@PathVariable Long id) {
        slideService.deleteSlide(id);
        return ResponseEntity.ok(Map.of("message", "Slide supprimé avec succès"));
    }

}
