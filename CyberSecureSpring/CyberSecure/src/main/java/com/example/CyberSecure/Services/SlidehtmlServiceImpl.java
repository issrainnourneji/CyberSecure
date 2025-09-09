package com.example.CyberSecure.Services;

import com.example.CyberSecure.Entities.Slidehtml;
import com.example.CyberSecure.Repositories.SlidehtmlRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class SlidehtmlServiceImpl {
    private final SlidehtmlRepository slidehtmlRepository;
    public Slidehtml save(Slidehtml slide) {
        return slidehtmlRepository.save(slide);
    }

    public List<Slidehtml> findAll() {
        return slidehtmlRepository.findAll();
    }
}