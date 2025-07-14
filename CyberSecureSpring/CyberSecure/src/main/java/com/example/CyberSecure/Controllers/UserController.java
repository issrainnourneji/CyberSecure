package com.example.CyberSecure.Controllers;

import com.example.CyberSecure.Dto.Response;
import com.example.CyberSecure.Dto.UserDto;
import com.example.CyberSecure.Repositories.UserRepository;
import com.example.CyberSecure.Services.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
    private final UserRepository userRepository;


    @GetMapping("/get-all")
    public ResponseEntity<Response> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/del/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.DeleteUser(id);
    }

    @GetMapping("/my-info")
    public ResponseEntity<Response> getUserInfoAndOrderHistory(){
        return ResponseEntity.ok(userService.getUserInfo());
    }

    @PutMapping("up/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto userDto
    ) {
        return userRepository.findById(id).map(user -> {
            if (userDto.getName() != null) {
                user.setName(userDto.getName());
            }
            if (userDto.getPhoneNumber() != null) {
                user.setPhoneNumber(userDto.getPhoneNumber());
            }
            if (userDto.getAddress() != null) {
                user.setAddress(userDto.getAddress());
            }
            userRepository.save(user);
            return ResponseEntity.ok(new UserDto(user));
        }).orElse(ResponseEntity.notFound().build());
    }
}