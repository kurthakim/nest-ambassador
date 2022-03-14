import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { createClient } from 'redis';
// import { RedisService } from '../shared/redis.service';

const client = createClient({
  url: 'redis://redis:6379',
});

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  await client.connect();

  const userService = app.get(UserService);

  const ambassadors: User[] = await userService.find({
    is_ambassador: true,
    relations: ['orders', 'orders.order_items'],
  });

  for (let i = 0; i < ambassadors.length; i++) {
    await client.zAdd('rankings', {
      score: ambassadors[i].revenue,
      value: ambassadors[i].name,
    });
  }

  process.exit();
})();
