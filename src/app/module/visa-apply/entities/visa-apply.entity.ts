import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type VisaApplyDocument = HydratedDocument<VisaApply>;

@Schema({ timestamps: true })
export class VisaApply {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Visa' })
  visaId!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop()
  fullName!: string;

  @Prop()
  email!: string;

  @Prop()
  phone!: string;

  @Prop()
  photo!: string;

  @Prop()
  nidCopy!: string;

  @Prop()
  passportCopy!: string;

  @Prop()
  bankStatement!: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status!: string;
}

export const VisaApplySchema = SchemaFactory.createForClass(VisaApply);
