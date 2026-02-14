import { Controller, Get, Param, ParseArrayPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@repo/api';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('search')
  search(
    @Query(
      'statuses',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    statuses: OrderStatus[],
    @Query('q') q: string,
  ) {
    return this.ordersService.searchAllByStatus(statuses, q);
  }

  @Get('list')
  findAllRaw(
    @Query(
      'statuses',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    statuses: OrderStatus[],
  ) {
    return this.ordersService.findAllByStatus(statuses);
  }

  @Get(':id/recipe')
  findRecipe(@Param('id') id: string) {
    return this.ordersService.findRecipe(id);
  }
}
