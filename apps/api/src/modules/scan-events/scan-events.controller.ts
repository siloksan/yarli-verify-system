import { Controller, Post, Body } from '@nestjs/common';
import { ScanEventsService } from './scan-events.service';
import { CreateScanEventDto } from './dto/create-scan-event.dto';
import { API_ROUTES } from '@repo/api';

@Controller(API_ROUTES.scan_events)
export class ScanEventsController {
  constructor(private readonly scanEventsService: ScanEventsService) {}

  @Post()
  create(@Body() createScanEventDto: CreateScanEventDto) {
    return this.scanEventsService.create(createScanEventDto);
  }
}
