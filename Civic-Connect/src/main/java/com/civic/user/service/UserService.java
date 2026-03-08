package com.civic.user.service;

import java.util.List;

import com.civic.user.dto.UserRequestDTO;
import com.civic.user.dto.UserResponseDTO;

public interface UserService {

    UserResponseDTO getUserById(Long id);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);

    void deleteUser(Long id);
}