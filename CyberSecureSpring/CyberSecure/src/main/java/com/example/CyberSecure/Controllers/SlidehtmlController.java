package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Entities.Slidehtml;
import com.example.CyberSecure.Services.SlideServiceImpl;
import com.example.CyberSecure.Services.SlidehtmlServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/slidehtml")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class SlidehtmlController {
    private final SlidehtmlServiceImpl slidehtmlService;

    @PostMapping
    public Slidehtml createSlide(@RequestBody Slidehtml slide) {
        return slidehtmlService.save(slide);
    }

    @GetMapping
    public List<Slidehtml> getAllSlides() {
        return slidehtmlService.findAll();
    }
}
