import { CreateNotificationDto } from '../dto/createAdminNotification.dto';

export interface NotificationServerToClientEvents {
  subscribed: (data: boolean) => void;
  created: (data: CreateNotificationDto) => void;
}

export interface NotificationClientToServerEvents {
  subscribe: () => void;
  create: (data: CreateNotificationDto) => void;
}
