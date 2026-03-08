package com.civic.auth.service;

import com.civic.auth.dto.AuthResponseDTO;
import com.civic.auth.dto.LoginRequestDTO;
import com.civic.auth.dto.RegisterRequestDTO;

public interface AuthService {
	AuthResponseDTO register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);
}
