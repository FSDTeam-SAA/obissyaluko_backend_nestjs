import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscribe,
  SubscribeSchema,
} from '../subscribe/entities/subscribe.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { Payment, PaymentSchema } from './entities/payment.entity';
import {
  Consultation,
  ConsultationSchema,
} from '../consultation/entities/consultation.entity';
import { Visa, VisaSchema } from '../visa/entities/visa.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscribe.name, schema: SubscribeSchema },
      { name: User.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Consultation.name, schema: ConsultationSchema },
      { name: Visa.name, schema: VisaSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
