import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VisaDocument = HydratedDocument<Visa>;

@Schema({ timestamps: true })
export class Visa {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country: string;

  @Prop()
  visaTitle: string;

  @Prop({ enum: ['tourist', 'work', 'student', 'family', 'business'] })
  category: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: String }] })
  eligibility: string[];

  @Prop({ type: [{ type: String }] })
  processingSteps: string[];

  @Prop({ type: [{ type: String }] })
  requiredDocuments: string[];

  @Prop()
  processingTime: string;

  @Prop()
  price: number;
}

export const VisaSchema = SchemaFactory.createForClass(Visa);
