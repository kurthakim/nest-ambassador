import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Order } from '../order';
import { client } from '../../main';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OrderListener {
  constructor() {} // private mailerService: MailerService

  @OnEvent('order_completed')
  async handleOrderCompletedEvent(order: Order) {
    client.zIncrBy('rankings', order.ambassador_revenue, order.name);

    await this.mailerService.sendMail({
      to: 'admin@admin.com',
      subject: 'An order has been completed',
      html: `Order #${order.id} with a total of ${order.total} has been completed!`,
    });

    await this.mailerService.sendMail({
      to: order.ambassador_email,
      subject: 'An order has been completed',
      html: `You earned #${order.ambassador_revenue} from the link #${order.code}`,
    });
  }
}
