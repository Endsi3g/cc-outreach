import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

class UpdateProfileDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() locale?: string;
  @IsBoolean() @IsOptional() notifyTelegram?: boolean;
  @IsBoolean() @IsOptional() notifyDiscord?: boolean;
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Profil courant' })
  me(@Req() req: { user: { id: string } }) {
    return this.users.findById(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour le profil' })
  update(@Req() req: { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.users.update(req.user.id, dto);
  }
}
