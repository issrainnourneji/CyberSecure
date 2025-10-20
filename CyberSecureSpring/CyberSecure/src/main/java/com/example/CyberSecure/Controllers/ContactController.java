package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Contact;
import com.example.CyberSecure.Services.EmailServiceImpl;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContactController {

    private final EmailServiceImpl emailService;

    @PostMapping
    public String sendContactMessage(@RequestBody Contact contactRequest) {
        try {
            String to = "israa.neji8@gmail.com";
            String subject = " Nouveau message de contact : " + contactRequest.getSubject();

            String content = """
                    <h3>Vous avez reçu un nouveau message depuis le formulaire de contact :</h3>
                    <p><strong>Nom :</strong> %s</p>
                    <p><strong>Email :</strong> %s</p>
                    <p><strong>Sujet :</strong> %s</p>
                    <p><strong>Message :</strong><br>%s</p>
                    """.formatted(
                    contactRequest.getName(),
                    contactRequest.getEmail(),
                    contactRequest.getSubject(),
                    contactRequest.getMessage()
            );

            emailService.sendSimpleEmail(to, subject, content);
            return "Message envoyé avec succès";
        } catch (MessagingException e) {
            return "Erreur lors de l'envoi du message : " + e.getMessage();
        }
    }
}