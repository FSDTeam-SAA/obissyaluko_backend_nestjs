import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUniversityDto {
  @ApiPropertyOptional({
    example: 'Cambridge University',
  })
  @IsString()
  @IsNotEmpty()
  universityName: string;

  @ApiPropertyOptional({
    example: 'UK',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  ranking: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    example: 'University Description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: 'https://www.cambridge.ac.uk',
  })
  @IsString()
  @IsNotEmpty()
  website: string;
}
