import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateHotelBookingDto {
  @ApiProperty()
  @IsMongoId()
  hotelId!: string;
  

  @ApiPropertyOptional({
    example: 'Saurav Sarkar',
  })
  @IsString()
  fullName!: string;


  @ApiPropertyOptional({
    example: 'saurav@gmail.com',
  })
  @IsEmail()
  email!: string;


  @ApiPropertyOptional({
    example: '+8801712345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;


  @ApiPropertyOptional({
    example: '2026-06-25',
  })
  @IsDateString()
  checkIn!: Date;


  @ApiPropertyOptional({
    example: '2026-06-28',
  })
  @IsDateString()
  checkOut!: Date;


  @ApiPropertyOptional({
    example: 2,
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  guests!: number;


  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  rooms!: number;


  @ApiPropertyOptional({
    example: 'Need sea view room',
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;


  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  totalAmount?: number
}