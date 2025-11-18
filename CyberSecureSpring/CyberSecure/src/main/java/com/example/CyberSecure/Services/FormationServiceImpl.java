package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.*;
import com.example.CyberSecure.Entities.Quiz.Question;
import com.example.CyberSecure.Entities.Quiz.Quiz;
import com.example.CyberSecure.Entities.Quiz.QuizResult;
import com.example.CyberSecure.Repositories.*;
import com.example.CyberSecure.Repositories.Quiz.QuestionRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizRepository;
import com.example.CyberSecure.Repositories.Quiz.QuizResultRepository;
import com.example.CyberSecure.Repositories.Quiz.ReponseRepository;
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
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final QuizResultRepository quizResultRepository;
    private final CertificationRepository certificationRepository;
    private final QuizRepository quizRepository;


    private static final String uploadDir = "C:/Users/starinfo/Desktop/CyberSecure/CyberSecureSpring/CyberSecure/uploads/";

    public Formation createFormation(String title, String description, MultipartFile image, double price,
                                     double duration, String categorie) throws IOException {

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
                categorie
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
                                     double price, double duration, String categorie) throws IOException {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        formation.setTitle(title);
        formation.setDescription(description);
        formation.setPrice(price);
        formation.setDuration(duration);
        formation.setCategorie(categorie);

        if (image != null && !image.isEmpty()) {
            String imageFileName = image.getOriginalFilename();
            String imagePath = uploadDir + imageFileName;
            image.transferTo(new File(imagePath));
            formation.setImageUrl(imageFileName);
        }

        return formationRepository.save(formation);
    }

    public void removeUserFromFormation(Long formationId, Long userId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Optional<CartItem> cartItemOpt = cartItemRepository.findByFormationIdAndUserId(formationId, userId);
        if (cartItemOpt.isPresent()) {
            cartItemRepository.delete(cartItemOpt.get());
        } else {
            throw new RuntimeException("L'utilisateur n'est pas inscrit à cette formation");
        }
    }

    public Formation findById(Long formationId) {
        return formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation introuvable avec l'id: " + formationId));
    }

    public Formation getFormationById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation introuvable avec l'id : " + id));
    }

    @Transactional
    public void deleteFormationWithAllDependencies(Long formationId) {
        // Récupérer la formation
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        // Supprimer les certificats liés à cette formation
        List<Certification> certifs = certificationRepository.findByFormation(formation);
        if (!certifs.isEmpty()) {
            certificationRepository.deleteAll(certifs);
        }

        // Supprimer les items du panier
        cartItemRepository.deleteByFormationId(formationId);

        // Supprimer les résultats des quiz
        for (Chapitre chapitre : formation.getChapitres()) {
            Quiz quiz = chapitre.getQuiz();
            if (quiz != null) {
                List<QuizResult> results = quizResultRepository.findByQuizId(quiz.getId());
                for (QuizResult qr : results) {
                    qr.getUserAnswers().clear(); // vider la Map
                    quizResultRepository.delete(qr);
                }
                // Supprimer le quiz lui-même, ce qui supprimera questions et réponses grâce au cascade
                chapitre.setQuiz(null); // détacher temporairement pour éviter TransientObjectException
                quizRepository.delete(quiz);
            }
        }

        // Détacher les chapitres de la formation pour éviter les TransientObjectException
        for (Chapitre chapitre : formation.getChapitres()) {
            chapitre.setFormation(null);
        }

        // Supprimer la formation (cascade supprimera chapitres et slides)
        formationRepository.delete(formation);
    }
    public List<String> getAllCategories() {
        return formationRepository.findDistinctCategories();
    }
    public List<Formation> getFormationsByCategory(String categorie) {
        return formationRepository.findByCategorie(categorie);
    }
}