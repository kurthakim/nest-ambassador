import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Order } from '../order';
import { client } from '../../main';

@Injectable()
export class OrderListener {
  constructor() {}

  @OnEvent('order_completed')
  async handleOrderCompletedEvent(order: Order) {
    client.zIncrBy('rankings', order.ambassador_revenue, order.name);
  }
}
