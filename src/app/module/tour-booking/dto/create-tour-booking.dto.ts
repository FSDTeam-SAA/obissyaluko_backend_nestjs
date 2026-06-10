import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsDate,
  IsOptional,
  IsMongoId,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTourBookingDto {
  @ApiProperty({ example: '664f1b2c8a1e4d001c8b4567', description: 'Tour ID' })
  @IsMongoId()
  tourId!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 8801712345678 })
  @IsNumber()
  phone!: number;

  @ApiProperty({ example: '2025-12-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  travelDate!: Date;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  numberOfPersons!: number;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiPropertyOptional({ example: 'Vegetarian meals preferred' })
  @IsOptional()
  @IsString()
  spacialRequests?: string;
}
