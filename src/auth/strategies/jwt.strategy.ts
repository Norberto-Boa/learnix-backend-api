<<<<<<< HEAD
import type { EnvService } from '@/env/env.service';
=======
import { EnvService } from '@/env/env.service';
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: EnvService) {
<<<<<<< HEAD
    const privateKey = config.get('JWT_SECRET');
=======
    const privateKey = config.get('JWT_SECRET_KEY');
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: privateKey,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
