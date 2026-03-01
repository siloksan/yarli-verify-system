import { Controller, Post, Body } from '@nestjs/common';
import { ScanEventsService } from './scan-events.service';
import {
  CreateBarcodeScanEventDto,
  CreateQrCodeScanEventDto,
} from './dto/create-scan-event.dto';
import { API_ROUTES } from '@repo/api';

@Controller(API_ROUTES.SCAN_EVENTS.root)
export class ScanEventsController {
  constructor(private readonly scanEventsService: ScanEventsService) {}

  @Post(API_ROUTES.SCAN_EVENTS.barcode)
  createBarCodeScanEvent(
    @Body() createScanEventDto: CreateBarcodeScanEventDto,
  ) {
    return this.scanEventsService.createBarcodeScanEvent(createScanEventDto);
  }

  @Post(API_ROUTES.SCAN_EVENTS.qrCode)
  createQrCodeScanEvent(@Body() createScanEventDto: CreateQrCodeScanEventDto) {
    return this.scanEventsService.createQrCodeScanEvent(createScanEventDto);
  }
}
