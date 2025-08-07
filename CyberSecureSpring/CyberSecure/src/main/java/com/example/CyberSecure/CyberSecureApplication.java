package com.example.CyberSecure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CyberSecureApplication {
	public static void main(String[] args) {
		SpringApplication.run(CyberSecureApplication.class, args);
	}
}

