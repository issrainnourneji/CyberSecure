package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Slide;
import com.example.CyberSecure.Services.SlideServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping ("/slide")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class SlideController {

    private final SlideServiceImpl  slideService;

    @PostMapping ("/add/{chapitreId}")
    public ResponseEntity <Slide > addSlide(
            @PathVariable  Long chapitreId,
            @RequestParam(required = false) String titre,
            @RequestParam(required = false) String sousTitre,
            @RequestParam(required = false) String paragraphe,
            @RequestParam(required = false) MultipartFile  image,
            @RequestParam(required = false) String videoUrl
    ) throws IOException  {
        Slide slide = slideService.addSlideToChapitre(
                chapitreId,
                titre,
                sousTitre,
                paragraphe,
                image,
                videoUrl
        );
        return ResponseEntity.ok(slide);
    }
}
