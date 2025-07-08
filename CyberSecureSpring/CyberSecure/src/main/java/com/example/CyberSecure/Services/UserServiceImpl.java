package com.example.CyberSecure.Services;

import com.example.CyberSecure.Dto.LoginRequest;
import com.example.CyberSecure.Dto.Response;
import com.example.CyberSecure.Dto.UserDto;
import com.example.CyberSecure.Entities.EmailVerif.EmailTemplateName;
import com.example.CyberSecure.Entities.EmailVerif.Token;
import com.example.CyberSecure.Entities.User;
import com.example.CyberSecure.Enums.UserRole;
import com.example.CyberSecure.Exceptions.InvalidCredentialsException;
import com.example.CyberSecure.Exceptions.NotFoundException;
import com.example.CyberSecure.Mapper.EntityDtoMapper;
import com.example.CyberSecure.Repositories.TokenRepository;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.mail.MessagingException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl {


    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;
    private final EmailServiceImpl emailService;
    private final TokenRepository tokenRepository;


    private String activationUrl = "http://localhost:4200/activate-account";



    @Transactional
    public Response registerUser(UserDto registrationRequest) {
        // Default user role is USER
        UserRole role = UserRole.USER;
        if (registrationRequest.getRole() != null && registrationRequest.getRole().equalsIgnoreCase("admin")) {
            role = UserRole.ADMIN;
        }

        // Create user object
        User user = User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .address(registrationRequest.getAddress())
                .accountLocked(false)
                .enabled(false)
                .role(role)
                .build();

        // Save the user temporarily
        User savedUser = userRepo.save(user);


        // Send validation email
        try {
            sendValidationEmail(savedUser);
        } catch (MessagingException e) {
            log.error("Failed to send validation email", e);
        }

        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);
        return Response.builder()
                .status(200)
                .message("User Successfully Added")
                .user(userDto)
                .build();
    }


    public Response loginUser(LoginRequest loginRequest) {

        User user = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new NotFoundException("Email not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password does not match");
        }
        if (!user.isEnabled()) {
            throw new IllegalStateException("Account not activated. Please check your email for the activation link.");
        }

        String token = jwtUtils.generateToken(user);

        return Response.builder()
                .status(200)
                .message("User Successfully Logged In")
                .token(token)
                .expirationTime("6 Month")
                .role(user.getRole().name())
                .build();
    }

    public Response getAllUsers() {

        List<User> users = userRepo.findAll();
        List<UserDto> userDtos = users.stream()
                .map(entityDtoMapper::mapUserToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .userList(userDtos)
                .build();
    }


    public User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        log.info("User Email is: " + email);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not found"));
    }

    public Response getUserInfo() {
        User user = getLoginUser();
        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(user);

        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid "));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = userRepo.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("Not found"));
        user.setEnabled(true);
        userRepo.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }


    public User findByEmail(String email) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        return optionalUser.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public void DeleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public void DeleteToken(Integer id) {
        tokenRepository.deleteById(id);
    }

    public void requestPasswordReset(String email) throws MessagingException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email not found"));

        String resetToken = generateResetToken();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepo.save(user);

        String resetUrl = "http://localhost:4200/reset-password?token=" + resetToken;

        emailService.sendEmailreset(
                user.getEmail(),
                user.getName(),
                "reset-password",  // Nom du template HTML
                resetUrl,
                "Reset Your Password"
        );
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepo.findByResetPasswordToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid reset token"));

        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepo.save(user);
    }
}
