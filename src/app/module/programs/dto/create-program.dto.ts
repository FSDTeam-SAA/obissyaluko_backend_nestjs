import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProgramDto {
  @ApiPropertyOptional({ example: '6a1926a0b27bbb7605844ae4' })
  @IsMongoId()
  @IsNotEmpty()
  university: string;

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiPropertyOptional({ example: 'bachelors' })
  @IsString()
  @IsNotEmpty()
  degreeLevel: string;

  @ApiPropertyOptional({ example: '2 years' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiPropertyOptional({ example: 13000 })
  @IsNumber()
  @IsNotEmpty()
  tutionFee: number;

  @ApiPropertyOptional({
    example:
      'First-class degree in CS or related field, strong mathematics background',
  })
  @IsString()
  @IsNotEmpty()
  eligibility: string;

  @ApiPropertyOptional({
    example: [
      'First-class degree in CS or related field',
      'strong mathematics background',
    ],
  })
  @IsArray()
  @IsNotEmpty()
  requirements: string[];

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  scholarship?: boolean;
}
