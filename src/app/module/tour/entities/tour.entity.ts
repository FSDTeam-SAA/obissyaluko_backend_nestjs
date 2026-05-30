import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TourDocument = HydratedDocument<Tour>;

@Schema({ timestamps: true })
export class Tour {
  @Prop()
  title: string;

  @Prop()
  destination: string;

  @Prop()
  price: number;

  @Prop()
  duration: string;

  @Prop()
  images: string[];

  @Prop()
  description: string;

  @Prop()
  itinerary: string[];

  @Prop()
  hotelInfo: string;

  @Prop()
  highlights: string[];

  @Prop()
  maxPersons: number;

  @Prop()
  isActive: boolean;
}

export const TourSchema = SchemaFactory.createForClass(Tour);
