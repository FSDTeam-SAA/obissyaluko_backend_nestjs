import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class CreateBlogDto {
  @ApiPropertyOptional({
    example: 'Magical Dubai Experience',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'short description' })
  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @ApiPropertyOptional({
    example: 'Tour content.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    example: 'Magical Dubai Experience',
  })
  @IsString()
  @IsOptional()
  category?: string;
}
