// import { Injectable, OnModuleDestroy } from '@nestjs/common';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisService implements OnModuleDestroy {
//   private readonly redis: Redis;

//   constructor() {
//     this.redis = new Redis({
//       host: process.env.REDIS_HOST,
//       port: Number(process.env.REDIS_PORT),
//       // password: process.env.REDIS_PASSWORD,
//     });
//   }

//   getClient(): Redis {
//     return this.redis;
//   }

//   async get(key: string) {
//     return this.redis.get(key);
//   }

//   async set(
//     key: string,
//     value: string,
//     ttlSeconds?: number,
//   ) {
//     if (ttlSeconds) {
//       return this.redis.set(key, value, 'EX', ttlSeconds);
//     }

//     return this.redis.set(key, value);
//   }

//   async del(key: string) {
//     return this.redis.del(key);
//   }

//   async exists(key: string) {
//     return this.redis.exists(key);
//   }

//   async onModuleDestroy() {
//     await this.redis.quit();
//   }
// }