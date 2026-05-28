import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';


const EmptyToUndefined = () =>
  Transform(({ value }) =>
    value === '' || value === null ? undefined : value,
  );

export class CreateUserDto {
  @ApiProperty({ example: '' })
  @EmptyToUndefined()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: '' })
  @EmptyToUndefined() 
  @IsString()
  lastName!: string;

  @ApiProperty({ example: '' })
  @EmptyToUndefined() 
  @IsOptional()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '' })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ enum: ['user', 'admin'] })
  @EmptyToUndefined()
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: string;

  @ApiPropertyOptional({ enum: ['male', 'female'] })
  @EmptyToUndefined()
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({ example: '' })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ example: '' })
  @EmptyToUndefined() 
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '' })
  @EmptyToUndefined() // ✅
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '' })
  @EmptyToUndefined() // ✅
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  @EmptyToUndefined() // ✅
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiPropertyOptional()
  @EmptyToUndefined() // ✅
  @IsOptional()
  otpExpiry?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null) return undefined; // ✅
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return value;
  })
  verifiedForget?: boolean;

  @ApiPropertyOptional({ enum: ['active', 'suspended'] })
  @EmptyToUndefined() // ✅
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '' })
  @EmptyToUndefined() // ✅
  @IsOptional()
  @IsString()
  stripeAccountId?: string;
}
