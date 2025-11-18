package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.CartItem;
import com.example.CyberSecure.Entities.Chapitre;
import com.example.CyberSecure.Entities.Formation;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Repositories.CartItemRepository;
import com.example.CyberSecure.Repositories.ChapitreRepository;
import com.example.CyberSecure.Repositories.FormationRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Services.CartServiceImpl;
import com.example.CyberSecure.Services.FormationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/formation")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class FormationController {

    private final FormationServiceImpl formationService;
    private final FormationRepository formationRepository;
    private final UserRepository userRepository;
    private final CartServiceImpl cartService;
    private final CartItemRepository cartItemRepository;
    private final ChapitreRepository chapitreRepository;




    @PostMapping("/add")
    public ResponseEntity<Formation> addFormation(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image,
            @RequestParam("price") double price,
            @RequestParam("duration") double duration,
            @RequestParam("categorie") String categorie
    ) throws IOException {
         Formation formation = formationService.createFormation(title, description, image , price , duration , categorie);
            return ResponseEntity.ok(formation);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Formation>> getAllFormation() {
        return ResponseEntity.ok(formationService.getAllFormations());
    }


    @DeleteMapping("/delete/{id}")
    public void deleteFormationz(@PathVariable("id") Long id) {
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
            @RequestParam("categorie") String categorie
    ) throws IOException {
        Formation updated = formationService.updateFormation(id, title, description, image, price, duration, categorie);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/my-formations")
    public ResponseEntity<List<Formation>> getMyFormations(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartService.getUserCart(user.getId());

        List<Formation> formations = cartItems.stream()
                .map(CartItem::getFormation)
                .toList();

        return ResponseEntity.ok(formations);
    }


    @GetMapping("/{formationId}/users")
    public ResponseEntity<List<User>> getUsersByFormation(@PathVariable Long formationId) {
        List<CartItem> cartItems = cartItemRepository.findByFormationId(formationId);
        List<User> users = cartItems.stream()
                .map(CartItem::getUser)
                .distinct()
                .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{formationId}/user/{userId}")
    public ResponseEntity<Map<String, String>> removeUserFromFormation(
            @PathVariable Long formationId,
            @PathVariable Long userId) {

        formationService.removeUserFromFormation(formationId, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur retiré de la formation avec succès");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/formations/students/count")
    public ResponseEntity<Map<Long, Long>> getNumberOfStudentsForAllFormations() {
        List<CartItem> cartItems = cartItemRepository.findAll();

        Map<Long, Long> countMap = cartItems.stream()
                .collect(Collectors.groupingBy(ci -> ci.getFormation().getId(), Collectors.counting()));

        return ResponseEntity.ok(countMap);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFormation(@PathVariable("id") Long formationId) {
        try {
            formationService.deleteFormationWithAllDependencies(formationId);
            return ResponseEntity.ok("Formation supprimée avec succès !");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erreur : " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + ex.getMessage());
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(formationService.getAllCategories());
    }
    @GetMapping("/category/{categorie}")
    public List<Formation> getFormationsByCategory(@PathVariable String categorie) {
        return formationService.getFormationsByCategory(categorie);
    }

    @GetMapping("/chapter/{chapitreId}/formation")
    public Formation getFormationByChapitre(@PathVariable Long chapitreId) {
        Chapitre chapitre = chapitreRepository.findById(chapitreId)
                .orElseThrow(() -> new RuntimeException("Chapitre introuvable"));
        return chapitre.getFormation(); // assuming getFormation() exists in Chapitre
    }
}
