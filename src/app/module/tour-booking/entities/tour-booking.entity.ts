import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

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

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status!: string;
}

export const TourBookingSchema = SchemaFactory.createForClass(TourBooking);
