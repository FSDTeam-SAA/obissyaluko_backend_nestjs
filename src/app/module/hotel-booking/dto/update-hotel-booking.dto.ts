import { PartialType } from '@nestjs/swagger';
import { CreateHotelBookingDto } from './create-hotel-booking.dto';

export class UpdateHotelBookingDto extends PartialType(CreateHotelBookingDto) {}
