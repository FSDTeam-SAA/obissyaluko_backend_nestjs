import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateTourDto {
  @ApiPropertyOptional({ example: 'tour title', description: 'Tour title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Magical Dubai Experience' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ example: 499 })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiPropertyOptional({ example: '5 Nights / 6 Days' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Tour images',
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: 'Tour description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: ['Day 1: Arrival in Dubai', 'Day 2: Desert Safari'],
  })
  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        if (value.includes(',')) {
          return value.split(',').map((item) => item.trim());
        }
        return [value.trim()];
      }
    }
    return value;
  })
  itinerary: string[];

  @ApiPropertyOptional({ example: 'Hotel Name' })
  @IsString()
  @IsNotEmpty()
  hotelInfo: string;

  @ApiPropertyOptional({
    example: ['Desert Safari', 'Burj Khalifa'],
  })
  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        if (value.includes(',')) {
          return value.split(',').map((item) => item.trim());
        }
        return [value.trim()];
      }
    }
    return value;
  })
  highlights: string[];

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  maxPersons: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  isActive: boolean;
}
