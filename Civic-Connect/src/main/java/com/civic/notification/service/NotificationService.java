package com.civic.notification.service;

import com.civic.notification.dto.NotificationResponseDTO;
import java.util.List;

public interface NotificationService {
    List<NotificationResponseDTO> getUserNotifications(Long userId);
    void markAsRead(Long notificationId);
    void sendNotification(Long userId, String message);
}
