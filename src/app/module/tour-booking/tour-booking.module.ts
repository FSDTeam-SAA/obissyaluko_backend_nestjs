import { Module } from '@nestjs/common';
import { TourBookingService } from './tour-booking.service';
import { TourBookingController } from './tour-booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TourBooking, TourBookingSchema } from './entities/tour-booking.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { Payment, PaymentSchema } from '../payment/entities/payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourBooking.name, schema: TourBookingSchema },
      { name: User.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [TourBookingController],
  providers: [TourBookingService],
})
export class TourBookingModule {}
