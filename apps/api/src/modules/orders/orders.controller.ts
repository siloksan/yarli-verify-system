import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderResponseDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.ordersService.findAll(q);
  }

  @Get('list')
  findAllRaw() {
    return this.ordersService.findAll();
  }

  @Get(':id/recipe')
  findRecipe(@Param('id') id: string) {
    return this.ordersService.findRecipe(id);
  }
}
