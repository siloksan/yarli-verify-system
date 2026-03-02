import { ScanEventWithOrderNotification } from './dto/scan-event-notification.dto';

export interface NotificationService {
  sendWrongScanEvent(payload: ScanEventWithOrderNotification): Promise<void>;
}
