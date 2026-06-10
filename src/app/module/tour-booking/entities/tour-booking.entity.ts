import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PaymentStatus } from '../../consultation/entities/consultation.entity';

export type TourBookingDocument = HydratedDocument<TourBooking>;

@Schema({ timestamps: true })
export class TourBooking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' })
  tourId!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop()
  fullName!: string;

  @Prop()
  email!: string;

  @Prop()
  phone!: number;

  @Prop()
  travelDate!: Date;

  @Prop()
  numberOfPersons!: number;

  @Prop()
  amount!: number;

  @Prop()
  spacialRequests!: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.FREE })
  paymentStatus!: PaymentStatus;

  @Prop({ enum: ['Pending', 'approved', 'rejected'], default: 'Pending' })
  adminStatus!: string;
}

export const TourBookingSchema = SchemaFactory.createForClass(TourBooking);
