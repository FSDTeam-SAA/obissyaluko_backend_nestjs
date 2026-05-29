import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UniversityDocument = HydratedDocument<University>;

@Schema({ timestamps: true })
export class University {
  @Prop()
  universityName: string;

  @Prop()
  country: string;

  @Prop()
  ranking: number;

  @Prop()
  image: string;

  @Prop()
  logo: string;

  @Prop()
  description: string;

  @Prop()
  website: string;
}

export const UniversitySchema = SchemaFactory.createForClass(University);
