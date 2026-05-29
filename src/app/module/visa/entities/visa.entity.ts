import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisaDocument = HydratedDocument<Visa>;

@Schema({ timestamps: true })
export class Visa {}

export const VisaSchema = SchemaFactory.createForClass(Visa);
