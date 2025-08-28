package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.CartItem;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FormationServiceImpl {
    private final FormationRepository formationRepository;
    private  final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;


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



    @Transactional
    public void DeleteFormation(Long formationId) {
        cartItemRepository.deleteByFormationId(formationId);

        formationRepository.deleteById(formationId);

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
    public void removeUserFromFormation(Long formationId, Long userId) {
        // Récupérer la formation
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        // Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Chercher le CartItem correspondant
        Optional<CartItem> cartItemOpt = cartItemRepository.findByFormationIdAndUserId(formationId, userId);
        if (cartItemOpt.isPresent()) {
            cartItemRepository.delete(cartItemOpt.get());
        } else {
            throw new RuntimeException("L'utilisateur n'est pas inscrit à cette formation");
        }
    }

}
