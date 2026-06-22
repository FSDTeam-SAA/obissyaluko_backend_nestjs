import { PartialType } from '@nestjs/swagger';
import { CreateHotalDto } from './create-hotal.dto';

export class UpdateHotalDto extends PartialType(CreateHotalDto) {}
