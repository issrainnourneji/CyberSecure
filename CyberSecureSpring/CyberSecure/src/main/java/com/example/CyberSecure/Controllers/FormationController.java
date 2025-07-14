package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Formation;
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
        List<Formation> formations = formationService.getAllFormations();
        return ResponseEntity.ok(formations);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFormation(@PathVariable("id") Long id) {
        formationService.DeleteFormation(id);
    }

}
