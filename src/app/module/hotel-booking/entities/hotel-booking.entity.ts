import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PaymentStatus } from '../../consultation/entities/consultation.entity';

export type HotelBookingDocument = HydratedDocument<HotelBooking>;

@Schema({ timestamps: true })
export class HotelBooking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotal', required: true })
  hotelId!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true })
  email!: string;

  @Prop()
  phone!: string;

  @Prop({ required: true })
  checkIn!: Date;

  @Prop({ required: true })
  checkOut!: Date;

  @Prop({ default: 1 })
  guests!: number;

  @Prop({ default: 1 })
  rooms!: number;

  @Prop()
  specialRequests!: string;

  @Prop({ default: 0 })
  totalAmount!: number;

  @Prop({ default: 0 })
  amount!: number;

  @Prop({
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status!: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PAID })
  paymentStatus!: PaymentStatus;

  @Prop({ enum: ['Pending', 'approved', 'rejected'], default: 'Pending' })
  adminStatus!: string;
}

export const HotelBookingSchema = SchemaFactory.createForClass(HotelBooking);
