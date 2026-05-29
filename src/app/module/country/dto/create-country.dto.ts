import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const ParseBoolean = () =>
  Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return value;
  });

export class CreateCountryDto {
  @ApiPropertyOptional({ example: 'Nepal' })
  @IsString()
  @IsNotEmpty()
  countryName: string;

  @ApiPropertyOptional({ example: 'NP' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  countryFlag?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  countryImage?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @ParseBoolean()
  visaAvailable?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @ParseBoolean()
  studyAvailable?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @ParseBoolean()
  popular?: boolean;
}
