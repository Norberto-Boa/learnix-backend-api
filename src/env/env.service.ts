<<<<<<< HEAD
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { Injectable } from '@nestjs/common';
=======
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env';
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}
<<<<<<< HEAD

=======
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff
  get<T extends keyof Env>(key: T) {
    return this.configService.get<T>(key, { infer: true });
  }
}
