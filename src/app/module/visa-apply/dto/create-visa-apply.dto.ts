import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVisaApplyDto {
  @ApiPropertyOptional({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'Visa ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  visaId: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Full name of applicant',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: '+8801712345678',
    description: 'Phone number',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Photo file',
  })
  photo: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'NID copy file',
  })
  nidCopy: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Passport copy file',
  })
  passportCopy: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Bank statement file',
  })
  bankStatement: any;
}
