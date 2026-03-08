package com.civic.notification.service;

import com.civic.notification.dto.NotificationResponseDTO;
import com.civic.notification.model.Notification;
import com.civic.notification.repo.NotificationRepository;
import com.civic.user.model.User;
import com.civic.user.repo.UserRepository;
import com.civic.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public List<NotificationResponseDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notification -> modelMapper.map(notification, NotificationResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void sendNotification(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .message(message)
                .recipient(user)
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        // Convert to DTO for WebSocket transmission
        NotificationResponseDTO dto = modelMapper.map(notification, NotificationResponseDTO.class);
        
        // Real-time WebSocket notification
        messagingTemplate.convertAndSendToUser(
                user.getEmail(), "/queue/notifications", dto);
    }
}
