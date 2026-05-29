import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ProgramDocument = HydratedDocument<Program>;

@Schema({ timestamps: true })
export class Program {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'University' })
  university: Types.ObjectId;

  @Prop()
  programName: string;

  @Prop()
  degreeLevel: string;

  @Prop()
  duration: string;

  @Prop()
  tutionFee: number;

  @Prop()
  eligibility: string;

  @Prop({ type: [{ type: String }] })
  requirements: string[];

  @Prop()
  scholarship: boolean;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
