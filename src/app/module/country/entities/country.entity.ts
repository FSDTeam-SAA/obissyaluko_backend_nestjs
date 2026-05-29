import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
  @Prop()
  countryName: string;

  @Prop()
  countryCode: string;

  @Prop()
  countryFlag: string;

  @Prop()
  countryImage: string;

  @Prop()
  visaAvailable: boolean;

  @Prop()
  studyAvailable: boolean;

  @Prop()
  popular: boolean;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
