package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Repositories.FormationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class FormationServiceImpl {
    private final FormationRepository formationRepository;


    private static final String uploadDir = "C:/Users/starinfo/Desktop/CyberSecure/CyberSecureSpring/CyberSecure/uploads/";

    public Formation createFormation(String title, String description, MultipartFile image, double price,
                                     double duration, int numberOfStudents) throws IOException {

        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        String imageFileName = image.getOriginalFilename();
        String imagePath = uploadDir + imageFileName;
        image.transferTo(new File(imagePath));

        Formation formation = new Formation(
                title,
                description,
                imageFileName,
                price,
                duration,
                numberOfStudents
        );

        return formationRepository.save(formation);
    }

    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    public void DeleteFormation(Long id) {
        formationRepository.deleteById(id);
    }

    public Formation updateFormation(Long id, String title, String description, MultipartFile image,
                                     double price, double duration, int numberOfStudents) throws IOException {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        formation.setTitle(title);
        formation.setDescription(description);
        formation.setPrice(price);
        formation.setDuration(duration);
        formation.setNumberOfStudents(numberOfStudents);

        if (image != null && !image.isEmpty()) {
            String imageFileName = image.getOriginalFilename();
            String imagePath = uploadDir + imageFileName;
            image.transferTo(new File(imagePath));
            formation.setImageUrl(imageFileName);
        }

        return formationRepository.save(formation);
    }


}
