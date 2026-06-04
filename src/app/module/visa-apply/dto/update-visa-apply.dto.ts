import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateVisaApplyDto } from './create-visa-apply.dto';

export class UpdateVisaApplyDto extends PartialType(CreateVisaApplyDto) {
  @ApiPropertyOptional({
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status?: string;
}
