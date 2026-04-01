import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';

class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() @IsOptional() name?: string;
}

class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "Créer un compte email/mot de passe" })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.auth.register(dto.email, dto.password, dto.name);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Connexion email/mot de passe" })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.auth.login(dto.email, dto.password);
    } catch {
      throw new UnauthorizedException('Identifiants invalides');
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: "Initier OAuth Google" })
  googleAuth() { /* redirigé par passport */ }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: "Callback OAuth Google" })
  googleCallback(@Req() req: { user: unknown }) { return req.user; }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Profil utilisateur connecté" })
  me(@Req() req: { user: unknown }) { return req.user; }
}
