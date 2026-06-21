import { Module } from '@nestjs/common';
import { HotelBookingService } from './hotel-booking.service';
import { HotelBookingController } from './hotel-booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HotelBooking,
  HotelBookingSchema,
} from './entities/hotel-booking.entity';
import { Hotal, HotalSchema } from '../hotals/entities/hotal.entity';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelBooking.name, schema: HotelBookingSchema },
      { name: Hotal.name, schema: HotalSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [HotelBookingController],
  providers: [HotelBookingService],
})
export class HotelBookingModule {}
