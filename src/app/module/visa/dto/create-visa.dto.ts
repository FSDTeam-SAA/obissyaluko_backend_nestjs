import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateVisaDto {
  @ApiProperty({ example: '6888ad708736158d6e728e53' })
  @IsMongoId()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'Tourist Visa' })
  @IsString()
  @IsNotEmpty()
  visaTitle: string;

  @ApiProperty({ example: 'Short-term visa for tourism and leisure' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: ['tourist', 'work', 'student', 'family', 'business'],
    example: 'tourist',
  })
  @IsEnum(['tourist', 'work', 'student', 'family', 'business'])
  category: string;

  @ApiProperty({
    type: [String],
    example: ['18-60 years old', 'Valid passport'],
    description: 'Eligibility criteria',
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  eligibility: string[];

  @ApiProperty({
    type: [String],
    example: [
      'Submit application form',
      'Pay the fee',
      'Attend interview (if required)',
    ],
    description: 'Processing steps',
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  processingSteps: string[];

  @ApiProperty({
    type: [String],
    example: ['Passport', 'Passport-sized photos', 'Bank statements'],
    description: 'Required documents',
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  requiredDocuments: string[];

  @ApiProperty({ example: '2-3 weeks', description: 'Processing time' })
  @IsString()
  @IsNotEmpty()
  processingTime: string;

  @ApiProperty({ example: 500, description: 'Price of the visa' })
  @IsNumber()
  price: number;
}
