import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { Payment, PaymentSchema } from '../payment/entities/payment.entity';
import {
  Subscribe,
  SubscribeSchema,
} from '../subscribe/entities/subscribe.entity';
import {
  Consultation,
  ConsultationSchema,
} from '../consultation/entities/consultation.entity';
import { Visa, VisaSchema } from '../visa/entities/visa.entity';
import {
  TourBooking,
  TourBookingSchema,
} from '../tour-booking/entities/tour-booking.entity';
import {
  HotelBooking,
  HotelBookingSchema,
} from '../hotel-booking/entities/hotel-booking.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Subscribe.name, schema: SubscribeSchema },
      { name: Consultation.name, schema: ConsultationSchema },
      { name: Visa.name, schema: VisaSchema },
      { name: TourBooking.name, schema: TourBookingSchema },
      { name: HotelBooking.name, schema: HotelBookingSchema },
    ]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
