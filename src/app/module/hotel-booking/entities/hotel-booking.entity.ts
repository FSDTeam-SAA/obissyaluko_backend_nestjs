import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HotelBookingDocument = HydratedDocument<HotelBooking>;

@Schema({ timestamps: true })
export class HotelBooking {
  @Prop({ type: Types.ObjectId, ref: 'Hotal', required: true })
  hotelId!: Types.ObjectId;

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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status!: string;
}

export const HotelBookingSchema = SchemaFactory.createForClass(HotelBooking);
