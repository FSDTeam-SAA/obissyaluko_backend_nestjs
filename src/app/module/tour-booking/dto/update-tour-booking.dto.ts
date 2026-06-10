import { PartialType } from '@nestjs/swagger';
import { CreateTourBookingDto } from './create-tour-booking.dto';

export class UpdateTourBookingDto extends PartialType(CreateTourBookingDto) {}
