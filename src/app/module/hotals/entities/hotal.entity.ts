import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HotalDocument = HydratedDocument<Hotal>;

@Schema({ timestamps: true })
export class Hotal {
  @Prop()
  hotalName!: string;

  @Prop()
  location!: string;

  @Prop()
  country!: string;

  @Prop()
  parNightPrice!: number;

  @Prop()
  rating!: number;

  @Prop()
  description!: string;

  @Prop()
  images!: string[];

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: string;
}

export const HotalSchema = SchemaFactory.createForClass(Hotal);
