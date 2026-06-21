import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateHotalDto {
  @ApiProperty({
    example: 'Hotel Paradise',
  })
  @IsString()
  hotalName!: string;

  @ApiProperty({
    example: "Cox's Bazar",
  })
  @IsString()
  location!: string;

  @ApiProperty({
    example: 'Bangladesh',
  })
  @IsString()
  country!: string;

  @ApiProperty({
    example: 120,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  parNightPrice!: number;

  @ApiPropertyOptional({
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Transform(({ value }) => Number(value))
  rating?: number;

  @ApiProperty({
    example: 'A luxury beachfront hotel with modern facilities.',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'binary',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}
