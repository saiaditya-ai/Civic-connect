package com.civic.auth.service;

import java.util.Optional;

import com.civic.auth.util.JwtUtils;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.civic.auth.dto.AuthResponseDTO;
import com.civic.auth.dto.LoginRequestDTO;
import com.civic.auth.dto.RegisterRequestDTO;
import com.civic.common.exception.ResourceNotFoundException;
import com.civic.user.model.User;
import com.civic.user.repo.UserRepository;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService{
	private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDTO register(RegisterRequestDTO request) {

        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            throw new ResourceNotFoundException("User already exists with this email");
        }

        // Convert DTO -> Entity
        User user = modelMapper.map(request, User.class);

        // Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
 
        // Save user
        userRepository.save(user);

        return new AuthResponseDTO("User registered successfully", null);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtUtils.generateToken(request.getEmail());
            return new AuthResponseDTO("Login successful", token);
        } else {
            throw new ResourceNotFoundException("Invalid email or password");
        }
    }
}
