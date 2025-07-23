package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Repositories.FormationRepository;
import com.example.CyberSecure.Services.FormationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/formation")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class FormationController {

    private final FormationServiceImpl formationService;
    private final FormationRepository formationRepository;



    @PostMapping("/add")
    public ResponseEntity<Formation> addFormation(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image,
            @RequestParam("price") double price,
            @RequestParam("duration") double duration,
            @RequestParam("numberOfStudents") int numberOfStudents
    ) throws IOException {
         Formation formation = formationService.createFormation(title, description, image , price , duration , numberOfStudents);
            return ResponseEntity.ok(formation);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Formation>> getAllFormation() {
        return ResponseEntity.ok(formationService.getAllFormations());
    }


    @DeleteMapping("/delete/{id}")
    public void deleteFormation(@PathVariable("id") Long id) {
        formationService.DeleteFormation(id);
    }

    @GetMapping("/get/{id}")
    public Formation getFormationById(@PathVariable Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Formation> updateFormation(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("price") double price,
            @RequestParam("duration") double duration,
            @RequestParam("numberOfStudents") int numberOfStudents
    ) throws IOException {
        Formation updated = formationService.updateFormation(id, title, description, image, price, duration, numberOfStudents);
        return ResponseEntity.ok(updated);
    }


}
