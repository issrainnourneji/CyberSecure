package com.example.CyberSecure.Controllers;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/files")
public class FileController {

    private final String uploadDir = "C:/Users/starinfo/Desktop/CyberSecure/CyberSecureSpring/CyberSecure/uploads/";

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // On devine le type MIME de l’image (png, jpeg, etc.)
            String contentType = filename.toLowerCase().endsWith(".png") ? MediaType.IMAGE_PNG_VALUE
                    : filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg") ? MediaType.IMAGE_JPEG_VALUE
                    : MediaType.APPLICATION_OCTET_STREAM_VALUE;

            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}