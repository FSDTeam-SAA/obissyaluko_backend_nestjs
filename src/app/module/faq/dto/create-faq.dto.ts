import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiPropertyOptional({
    example: 'What is the best time to visit Dubai?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiPropertyOptional({
    example:
      'The best time to visit Dubai is from November to March when the weather is pleasant.',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiPropertyOptional({
    example: 'visa',
  })
  @IsString()
  @IsOptional()
  category?: string;
}
