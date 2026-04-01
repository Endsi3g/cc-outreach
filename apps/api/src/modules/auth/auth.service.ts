import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error('Un compte avec cet email existe déjà.');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.users.create({ email, passwordHash, name });
    return this.signToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.passwordHash) throw new Error('Identifiants invalides.');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Identifiants invalides.');

    return this.signToken(user.id, user.email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.passwordHash) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async googleCallback(profile: { id: string; email: string; name?: string; photo?: string }) {
    let user = await this.users.findByGoogleId(profile.id);
    if (!user) {
      user = await this.users.findByEmail(profile.email);
      if (user) {
        user = await this.users.update(user.id, { googleId: profile.id, avatarUrl: profile.photo });
      } else {
        user = await this.users.create({
          email: profile.email,
          name: profile.name,
          googleId: profile.id,
          avatarUrl: profile.photo,
        });
      }
    }
    return this.signToken(user.id, user.email);
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: userId, email },
    };
  }
}
