import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ContactsService } from './contacts.service';
import { ContactRole, ContactConfidence, SourceType } from '@cc-outreach/shared-types';

class CreateContactDto {
  @IsString() companyId: string;
  @IsString() @IsOptional() firstName?: string;
  @IsString() @IsOptional() lastName?: string;
  @IsString() @IsOptional() fullName?: string;
  @IsEnum(ContactRole) @IsOptional() role?: ContactRole;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() linkedinUrl?: string;
  @IsEnum(SourceType) source: SourceType;
  @IsEnum(ContactConfidence) @IsOptional() confidence?: ContactConfidence;
  @IsString() @IsOptional() notes?: string;
}

@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contacts: ContactsService) {}

  @Post() create(@Body() dto: CreateContactDto) { return this.contacts.create(dto); }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Contacts d\'une entreprise' })
  byCompany(@Param('companyId') id: string) { return this.contacts.findByCompany(id); }

  @Get(':id') findOne(@Param('id') id: string) { return this.contacts.findById(id); }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateContactDto>) {
    return this.contacts.update(id, dto);
  }

  @Delete(':id') remove(@Param('id') id: string) { return this.contacts.delete(id); }
}
