import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RedisService } from '../shared/redis.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user';
import { UserService } from './user.service';
import { Response } from 'express';
import { client } from '../main';

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Get('admin/ambassadors')
  ambassadors() {
    return this.userService.find({
      is_ambassador: true,
    });
  }

  // @Get('ambassador/rankings')
  // async rankings(@Res() response: Response) {
  //   // const ambassadors: User[] = await this.userService.find({
  //   //   is_ambassador: true,
  //   //   relations: ['orders', 'orders.order_items'],
  //   // });

  //   // return ambassadors.map((ambassador) => {
  //   //   return {
  //   //     name: ambassador.name,
  //   //     revenue: ambassador.revenue,
  //   //   };
  //   // });
  //   const client = this.redisService.getClient();

  //   client.zrevrangebyscore(
  //     'rankings',
  //     '+inf',
  //     '-inf',
  //     'withscores',
  //     (err, result) => {
  //       response.send(result);
  //     },
  //   );
  // }

  @Get('ambassador/rankings')
  async rankings(@Res() res: Response) {
    console.log('rankings');
    const result: string[] = await client.sendCommand([
      'ZREVRANGEBYSCORE',
      'rankings',
      '+inf',
      '-inf',
      'WITHSCORES',
    ]);
    let name;

    res.send(
      result.reduce((o, r) => {
        if (isNaN(parseInt(r))) {
          name = r;
          return o;
        } else {
          return {
            ...o,
            [name]: parseInt(r),
          };
        }
      }, {}),
    );
  }
}
